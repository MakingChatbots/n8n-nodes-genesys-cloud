import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { genesysCloudApiRequest, genesysCloudApiRequestAllItems } from './GenericFunctions';

export async function conversationOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;
	const qs: IDataObject = {};

	if (operation === 'get') {
		const conversationId = this.getNodeParameter('conversationId', index) as string;
		responseData = await genesysCloudApiRequest.call(
			this,
			'GET',
			`/api/v2/conversations/${conversationId}`,
			{},
			qs,
		);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const limit = returnAll ? 0 : (this.getNodeParameter('limit', index) as number);
		const startDate = this.getNodeParameter('startDate', index) as string;
		const endDate = this.getNodeParameter('endDate', index) as string;
		const interval = `${startDate}/${endDate}`;
		const options = this.getNodeParameter('options', index) as IDataObject;

		const body: IDataObject = {
			interval,
		};

		// Add sorting options if provided
		if (options.order) {
			body.order = options.order;
		}
		if (options.orderBy) {
			body.orderBy = options.orderBy;
		}

		// Transform segment filters from the predicate builder into API format
		// Note: mediaType, direction, queueId, userId, wrapUpCode are segment-level dimensions
		const segmentFiltersOption = options.segmentFilters as IDataObject | undefined;
		if (segmentFiltersOption?.filters) {
			const filters = segmentFiltersOption.filters as IDataObject[];
			if (filters.length > 0) {
				const predicates = filters.map((filter) => {
					const predicate: IDataObject = {
						type: 'dimension',
						dimension: filter.dimension,
						operator: filter.operator,
					};
					// Only include value for 'matches' operator
					if (filter.operator === 'matches' && filter.value) {
						predicate.value = filter.value;
					}
					return predicate;
				});

				body.segmentFilters = [
					{
						type: 'and',
						predicates,
					},
				];
			}
		}

		// Analytics API uses body pagination
		responseData = await genesysCloudApiRequestAllItems.call(
			this,
			'conversations', // The property name in the response is 'conversations'
			'POST',
			'/api/v2/analytics/conversations/details/query',
			body,
			qs,
			limit,
			'body', // Enable body pagination
		);
	}

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
		{ itemData: { item: index } },
	);
}
