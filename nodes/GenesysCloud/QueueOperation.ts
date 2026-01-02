import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { genesysCloudApiRequest, genesysCloudApiRequestAllItems } from './GenericFunctions';

export async function queueOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'create') {
		return create.call(this, index);
	} else if (operation === 'get') {
		return get.call(this, index);
	} else if (operation === 'getAll') {
		return getAll.call(this, index);
	} else if (operation === 'getMembers') {
		return getMembers.call(this, index);
	} else if (operation === 'addMembers') {
		return addMembers.call(this, index);
	}

	return [];
}

async function create(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const body: IDataObject = {
		name,
	};
	const description = this.getNodeParameter('description', index) as string;
	if (description) {
		body.description = description;
	}
	const divisionId = this.getNodeParameter('divisionId', index) as string;
	if (divisionId) {
		body.division = { id: divisionId };
	}

	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;
	Object.assign(body, additionalFields);

	const responseData = await genesysCloudApiRequest.call(
		this,
		'POST',
		'/api/v2/routing/queues',
		body,
	);

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
		{ itemData: { item: index } },
	);
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

export async function addMembers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const queueId = this.getNodeParameter('queueId', index) as string;
	const userIds = this.getNodeParameter('userIds', index) as string | string[];

	let members: IDataObject[] = [];
	if (Array.isArray(userIds)) {
		members = userIds.map((id) => ({ id: id.trim() }));
	} else {
		members = userIds.split(',').map((id) => ({ id: id.trim() }));
	}

	const responseData = await genesysCloudApiRequest.call(
		this,
		'POST',
		`/api/v2/routing/queues/${queueId}/members`,
		members,
	);

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
		{ itemData: { item: index } },
	);
}
