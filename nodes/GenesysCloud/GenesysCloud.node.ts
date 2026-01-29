import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { queueFields, queueOperations } from './QueueDescription';
import { queueOperation } from './QueueOperation';
import { userFields, userOperations } from './UserDescription';
import { userOperation } from './UserOperation';
import { conversationFields, conversationOperations } from './ConversationDescription';
import { conversationOperation } from './ConversationOperation';
import { groupFields, groupOperations } from './GroupDescription';
import { groupOperation } from './GroupOperation';
import { divisionFields, divisionOperations } from './DivisionDescription';
import { divisionOperation } from './DivisionOperation';

export class GenesysCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Genesys Cloud',
		name: 'genesysCloud',
		icon: 'file:genesysCloud.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Consume Genesys Cloud API',
		defaults: {
			name: 'Genesys Cloud',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'genesysCloudPlatformApiOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'oAuth2',
				description: 'OAuth Authorization Flow',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Conversation',
						value: 'conversation',
						description: 'A conversation in the system',
					},
					{
						name: 'Division',
						value: 'division',
						description: 'A division in the system',
					},
					{
						name: 'Group',
						value: 'group',
						description: 'A group in the system',
					},
					{
						name: 'Queue',
						value: 'queue',
						description:
							'Represents an individual queue, which is an organization or person involved with your business (such as customers, competitors, and partners)',
					},
					{
						name: 'User',
						value: 'user',
						description: 'A user in the system',
					},
				],
				default: 'queue',
			},
			...queueOperations,
			...userOperations,
			...conversationOperations,
			...groupOperations,
			...divisionOperations,
			...queueFields,
			...userFields,
			...conversationFields,
			...groupFields,
			...divisionFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				switch (resource) {
					case 'queue': {
						const queueResults = await queueOperation.call(this, itemIndex);
						returnData.push(...queueResults);
						break;
					}
					case 'user': {
						const userResults = await userOperation.call(this, itemIndex);
						returnData.push(...userResults);
						break;
					}
					case 'conversation': {
						const conversationResults = await conversationOperation.call(this, itemIndex);
						returnData.push(...conversationResults);
						break;
					}
					case 'group': {
						const groupResults = await groupOperation.call(this, itemIndex);
						returnData.push(...groupResults);
						break;
					}
					case 'division': {
						const divisionResults = await divisionOperation.call(this, itemIndex);
						returnData.push(...divisionResults);
						break;
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
