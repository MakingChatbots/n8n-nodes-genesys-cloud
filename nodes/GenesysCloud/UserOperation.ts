import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { genesysCloudApiRequest, genesysCloudApiRequestAllItems } from './GenericFunctions';

export async function userOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;
	const qs: IDataObject = {};

	if (operation === 'get') {
		const userId = this.getNodeParameter('userId', index) as string;
		responseData = await genesysCloudApiRequest.call(
			this,
			'GET',
			`/api/v2/users/${userId}`,
			{},
			qs,
		);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const limit = returnAll ? 0 : (this.getNodeParameter('limit', index) as number);
		const options = this.getNodeParameter('options', index) as IDataObject;

		Object.assign(qs, options);

		responseData = await genesysCloudApiRequestAllItems.call(
			this,
			'entities',
			'GET',
			'/api/v2/users',
			{},
			qs,
			limit,
		);
	}

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject[]),
		{ itemData: { item: index } },
	);
}
