import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { genesysCloudApiRequest, genesysCloudApiRequestAllItems } from './GenericFunctions';

export async function queueOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'get') {
		return get.call(this, index);
	} else if (operation === 'getAll') {
		return getAll.call(this, index);
	} else if (operation === 'getMembers') {
		return getMembers.call(this, index);
	}

	return [];
}

async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const queueId = this.getNodeParameter('queueId', index) as string;

	const responseData = await genesysCloudApiRequest.call(
		this,
		'GET',
		`/api/v2/routing/queues/${queueId}`,
	);

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
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
	const options = this.getNodeParameter('options', index) as IDataObject;

	Object.assign(qs, options);

	const responseData = await genesysCloudApiRequestAllItems.call(
		this,
		'entities',
		'GET',
		'/api/v2/routing/queues',
		{},
		qs,
		limit,
	);

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
		{ itemData: { item: index } },
	);
}

export async function getMembers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const queueId = this.getNodeParameter('queueId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const qs: IDataObject = {};

	const limit = returnAll ? 0 : (this.getNodeParameter('limit', index) as number);
	const options = this.getNodeParameter('options', index) as IDataObject;

	Object.assign(qs, options);

	const responseData = await genesysCloudApiRequestAllItems.call(
		this,
		'entities',
		'GET',
		`/api/v2/routing/queues/${queueId}/members`,
		{},
		qs,
		limit,
	);

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
		{ itemData: { item: index } },
	);
}
