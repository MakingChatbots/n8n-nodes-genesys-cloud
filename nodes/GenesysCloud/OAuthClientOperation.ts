import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
	sleep,
} from 'n8n-workflow';
import { genesysCloudApiRequest, genesysCloudApiRequestAllItems } from './GenericFunctions';

export async function oauthClientOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'get') {
		return get.call(this, index);
	} else if (operation === 'getAll') {
		return getAll.call(this, index);
	} else if (operation === 'getUsage') {
		return getUsage.call(this, index);
	}

	return [];
}

async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const oauthClientId = this.getNodeParameter('oauthClientId', index) as string;

	const responseData = await genesysCloudApiRequest.call(
		this,
		'GET',
		`/api/v2/oauth/clients/${oauthClientId}`,
	);

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject),
		{ itemData: { item: index } },
	);
}

export async function getAll(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: IDataObject = {};

	const limit = returnAll ? 0 : (this.getNodeParameter('limit', index) as number);

	const responseData = await genesysCloudApiRequestAllItems.call(
		this,
		'entities',
		'GET',
		'/api/v2/oauth/clients',
		{},
		qs,
		limit,
	);

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
		{ itemData: { item: index } },
	);
}

async function getUsage(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const oauthClientId = this.getNodeParameter('oauthClientId', index) as string;
	const startDate = this.getNodeParameter('startDate', index) as string;
	const endDate = this.getNodeParameter('endDate', index) as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	// Validate date formats
	const startDateTime = new Date(startDate);
	const endDateTime = new Date(endDate);

	if (isNaN(startDateTime.getTime())) {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid start date format: "${startDate}". Please provide a valid ISO 8601 date string (e.g., 2024-01-01T00:00:00Z).`,
			{ itemIndex: index },
		);
	}

	if (isNaN(endDateTime.getTime())) {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid end date format: "${endDate}". Please provide a valid ISO 8601 date string (e.g., 2024-01-31T23:59:59Z).`,
			{ itemIndex: index },
		);
	}

	// Validate date range
	if (startDateTime >= endDateTime) {
		throw new NodeOperationError(
			this.getNode(),
			`Start date (${startDate}) must be before end date (${endDate}).`,
			{ itemIndex: index },
		);
	}

	// Build request body
	const body: IDataObject = {
		interval: `${startDate}/${endDate}`,
		metrics: options.metrics || ['Requests'],
		groupBy: options.groupBy || ['TemplateUri', 'HttpMethod'],
	};

	if (options.granularity) {
		body.granularity = options.granularity;
	}

	// Submit query
	const executionResult = await genesysCloudApiRequest.call(
		this,
		'POST',
		`/api/v2/oauth/clients/${oauthClientId}/usage/query`,
		body,
	);

	const executionId = executionResult.executionId as string;
	if (!executionId) {
		throw new NodeOperationError(
			this.getNode(),
			`Failed to submit usage query for OAuth client ${oauthClientId}. No executionId returned.`,
			{ itemIndex: index },
		);
	}

	// Poll for results with timeout
	const MAX_ATTEMPTS = 10;
	const POLL_INTERVAL = 3000; // 3 seconds
	let attempts = 0;

	while (attempts < MAX_ATTEMPTS) {
		const queryResult = await genesysCloudApiRequest.call(
			this,
			'GET',
			`/api/v2/oauth/clients/${oauthClientId}/usage/query/results/${executionId}`,
		);

		const status = (queryResult.queryStatus as string)?.toUpperCase();

		if (status === 'COMPLETE') {
			// Transform and return results
			const results = (queryResult.results as IDataObject[]) || [];
			const totalRequests = results.reduce(
				(sum, row) => sum + ((row.requests as number) || 0),
				0,
			);
			const requestsPerEndpoint = results.map((row) => ({
				endpoint: [row.httpMethod, row.templateUri].filter(Boolean).join(' '),
				requests: row.requests,
			}));

			const responseData = {
				startDate,
				endDate,
				totalRequests,
				requestsPerEndpoint,
			};

			return this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{ itemData: { item: index } },
			);
		}

		if (status === 'FAILED') {
			throw new NodeOperationError(
				this.getNode(),
				`Usage query failed for OAuth client ${oauthClientId}.`,
				{ itemIndex: index },
			);
		}

		// Wait before next poll
		await sleep(POLL_INTERVAL);
		attempts++;
	}

	throw new NodeOperationError(
		this.getNode(),
		`Timeout waiting for usage query to complete for OAuth client ${oauthClientId}.`,
		{ itemIndex: index },
	);
}
