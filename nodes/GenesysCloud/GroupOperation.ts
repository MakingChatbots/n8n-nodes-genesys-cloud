import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { genesysCloudApiRequest, genesysCloudApiRequestAllItems } from './GenericFunctions';

export async function groupOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'get') {
		return get.call(this, index);
	} else if (operation === 'getAll') {
		return getAll.call(this, index);
	}

	return [];
}

async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;

	const responseData = await genesysCloudApiRequest.call(this, 'GET', `/api/v2/groups/${groupId}`);

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
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

	// Pass all options (like sortOrder) to the query string
	Object.assign(qs, options);

	const responseData = await genesysCloudApiRequestAllItems.call(
		this,
		'entities',
		'GET',
		'/api/v2/groups',
		{},
		qs,
		limit,
	);

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
		{ itemData: { item: index } },
	);
}
