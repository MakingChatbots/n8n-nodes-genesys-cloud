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

	let responseData;
	let pageNumber = 1;

	// Initial request
	let requestBody = body;
	let requestQuery = { ...query };

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

	responseData = await genesysCloudApiRequest.call(
		this,
		method,
		endpoint,
		requestBody,
		requestQuery,
	);
	const items = responseData[propertyName];
	if (Array.isArray(items)) {
		returnData.push(...(items as IDataObject[]));
	}

	// Pagination Loop
	while (true) {
		if (limit > 0 && returnData.length >= limit) {
			returnData.length = limit;
			break;
		}

		if (responseData.cursor) {
			// Cursor-based pagination - cursor is always a query param
			requestQuery = {
				...query,
				cursor: responseData.cursor,
			};
		} else if (
			// Check for typical pageCount presence
			responseData.pageCount &&
			responseData.pageNumber &&
			responseData.pageNumber < responseData.pageCount
		) {
			// Page-based pagination
			pageNumber++;
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
		} else if (
			// Analytics often doesn't have pageCount, implies looking at results length?
			// Or they return totalHits?
			// For now assuming pageCount logic works or we might need totalHits logic for analytics
			paginationLoc === 'body' &&
			responseData.conversations &&
			responseData.conversations.length > 0
		) {
			// If we got results, try next page.
			// Analytics API usually limits queries anyway, but let's assume standard paging behavior
			pageNumber++;
			requestBody = {
				...body,
				paging: {
					pageSize: 25,
					pageNumber,
				},
			};
		} else if (responseData.nextUri) {
			// Next URI based (fallback/alternative) - some endpoints rely purely on this
			// We need to parse the query params from nextUri if we want to stick to 'genesysCloudApiRequest'
			// For now, let's assume pageNumber/cursor covers most, or we can rely on pageNumber logic above which usually aligns with nextUri
			break;
		} else {
			// No more pages
			break;
		}

		responseData = await genesysCloudApiRequest.call(
			this,
			method,
			endpoint,
			requestBody,
			requestQuery,
		);
		const nextItems = responseData[propertyName];
		if (Array.isArray(nextItems)) {
			returnData.push(...(nextItems as IDataObject[]));
		}
	}

	return returnData;
}
