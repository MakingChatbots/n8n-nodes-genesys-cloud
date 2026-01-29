import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IPollFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

/**
 * Makes an authenticated request to the Genesys Cloud Platform API.
 *
 * Automatically handles authentication using stored credentials and constructs
 * the full API URL based on the configured region.
 *
 * @param method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param resource - API endpoint path (e.g., '/api/v2/routing/queues/{id}')
 * @param body - Request body data (optional, defaults to empty object)
 * @param query - Query string parameters (optional, defaults to empty object)
 * @returns Promise resolving to the API response data
 * @throws {NodeApiError} When the API request fails or returns an error
 *
 * @example
 * // Get a single queue
 * const queue = await genesysCloudApiRequest.call(
 *   this,
 *   'GET',
 *   '/api/v2/routing/queues/queue-id-123'
 * );
 *
 * @example
 * // Create a queue with body data
 * const newQueue = await genesysCloudApiRequest.call(
 *   this,
 *   'POST',
 *   '/api/v2/routing/queues',
 *   { name: 'Support Queue', description: 'Customer support' }
 * );
 *
 * @example
 * // Get users with query parameters
 * const users = await genesysCloudApiRequest.call(
 *   this,
 *   'GET',
 *   '/api/v2/users',
 *   {},
 *   { state: 'active', pageSize: 100 }
 * );
 */
export async function genesysCloudApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject | IDataObject[] = {},
	query: IDataObject = {},
) {
	const credentials = await this.getCredentials('genesysCloudPlatformApiOAuth2Api');
	const region = credentials.region as string;
	const baseUrl = `https://api.${region}`;

	const options: IHttpRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs: query,
		url: `${baseUrl}${resource}`,
		json: true,
	};

	if (!Object.keys(body).length) {
		delete options.body;
	}
	if (!Object.keys(query).length) {
		delete options.qs;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(
			this,
			'genesysCloudPlatformApiOAuth2Api',
			options,
		);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Determines if there are more pages to fetch based on response metadata.
 *
 * Checks for cursor-based pagination (cursor field) or page-based pagination
 * (pageNumber < pageCount).
 *
 * @param responseData - The API response object
 * @returns True if more pages are available, false otherwise
 *
 * @internal
 */
function hasMorePages(responseData: IDataObject): boolean {
	// Cursor-based pagination
	if (responseData.cursor) {
		return true;
	}

	// Page-based pagination with pageCount
	if (
		responseData.pageCount &&
		responseData.pageNumber &&
		responseData.pageNumber < responseData.pageCount
	) {
		return true;
	}

	return false;
}

/**
 * Prepares pagination parameters for the next request.
 *
 * Handles both cursor-based and page-based pagination. For cursor-based pagination,
 * adds the cursor to query parameters. For page-based pagination, increments the
 * page number in either the query string or request body based on paginationLoc.
 *
 * @param responseData - The current API response containing pagination metadata
 * @param currentPageNumber - The current page number (used for page-based pagination)
 * @param paginationLoc - Where pagination params should be sent ('query' or 'body')
 * @param originalBody - The original request body to preserve other fields
 * @param originalQuery - The original query parameters to preserve other fields
 * @returns Object containing updated body, query, and pageNumber for next request
 *
 * @internal
 */
function getNextPageParams(
	responseData: IDataObject,
	currentPageNumber: number,
	paginationLoc: 'query' | 'body',
	originalBody: IDataObject,
	originalQuery: IDataObject,
): { body: IDataObject; query: IDataObject; pageNumber: number } {
	// Cursor-based pagination - cursor is always a query param
	if (responseData.cursor) {
		return {
			body: originalBody,
			query: {
				...originalQuery,
				cursor: responseData.cursor,
			},
			pageNumber: currentPageNumber,
		};
	}

	// Page-based pagination
	const nextPageNumber = currentPageNumber + 1;

	if (paginationLoc === 'body') {
		return {
			body: {
				...originalBody,
				paging: {
					pageSize: 25,
					pageNumber: nextPageNumber,
				},
			},
			query: originalQuery,
			pageNumber: nextPageNumber,
		};
	} else {
		return {
			body: originalBody,
			query: {
				...originalQuery,
				pageNumber: nextPageNumber,
			},
			pageNumber: nextPageNumber,
		};
	}
}

/**
 * Makes paginated requests to the Genesys Cloud Platform API and returns all items.
 *
 * Automatically handles pagination using either cursor-based or page-based pagination.
 * Continues fetching until all items are retrieved or the specified limit is reached.
 *
 * @param propertyName - Name of the property in the response containing the items array
 *                       (e.g., 'entities' for most endpoints, 'conversations' for analytics)
 * @param method - HTTP method (typically GET or POST for analytics queries)
 * @param endpoint - API endpoint path
 * @param body - Request body data (optional, defaults to empty object)
 * @param query - Query string parameters (optional, defaults to empty object)
 * @param limit - Maximum number of items to return (0 = unlimited, defaults to 0)
 * @param paginationLoc - Where to send pagination params: 'query' or 'body' (defaults to 'query')
 * @returns Promise resolving to array of all items from paginated responses
 * @throws {NodeApiError} When any API request in the pagination sequence fails
 *
 * @example
 * // Get all queues (query-based pagination)
 * const queues = await genesysCloudApiRequestAllItems.call(
 *   this,
 *   'entities',
 *   'GET',
 *   '/api/v2/routing/queues'
 * );
 *
 * @example
 * // Get up to 50 users with filters
 * const users = await genesysCloudApiRequestAllItems.call(
 *   this,
 *   'entities',
 *   'GET',
 *   '/api/v2/users',
 *   {},
 *   { state: 'active' },
 *   50
 * );
 *
 * @example
 * // Get conversations using body-based pagination (analytics API)
 * const conversations = await genesysCloudApiRequestAllItems.call(
 *   this,
 *   'conversations',
 *   'POST',
 *   '/api/v2/analytics/conversations/details/query',
 *   { interval: '2024-01-01T00:00:00Z/2024-01-31T23:59:59Z' },
 *   {},
 *   0,
 *   'body'
 * );
 */
export async function genesysCloudApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	limit: number = 0,
	paginationLoc: 'query' | 'body' = 'query',
) {
	const returnData: IDataObject[] = [];
	let pageNumber = 1;

	// Prepare initial request parameters
	let requestBody = body;
	let requestQuery = query;

	if (paginationLoc === 'body') {
		requestBody = {
			...body,
			paging: {
				pageSize: 25,
				pageNumber,
			},
		};
	} else {
		requestQuery = {
			...query,
			pageNumber,
		};
	}

	// Fetch pages until limit reached or no more pages
	while (true) {
		// Make the API request
		const responseData = await genesysCloudApiRequest.call(
			this,
			method,
			endpoint,
			requestBody,
			requestQuery,
		);

		// Extract and add items from response
		const items = responseData[propertyName];
		if (Array.isArray(items)) {
			returnData.push(...(items as IDataObject[]));
		}

		// Check if we've reached the limit
		if (limit > 0 && returnData.length >= limit) {
			returnData.length = limit;
			break;
		}

		// Check if there are more pages
		if (!hasMorePages(responseData)) {
			break;
		}

		// Prepare parameters for next page
		const nextParams = getNextPageParams(responseData, pageNumber, paginationLoc, body, query);
		requestBody = nextParams.body;
		requestQuery = nextParams.query;
		pageNumber = nextParams.pageNumber;
	}

	return returnData;
}
