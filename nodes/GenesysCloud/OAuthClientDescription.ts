import type { INodeProperties } from 'n8n-workflow';

export const oauthClientOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['oauthClient'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an OAuth client',
				action: 'Get an oauth client',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many OAuth clients',
				action: 'Get many oauth clients',
			},
		],
		default: 'get',
	},
];

export const oauthClientFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                oauthClient:get                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'OAuth Client ID',
		name: 'oauthClientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oauthClient'],
				operation: ['get'],
			},
		},
		description: 'ID of OAuth client that needs to be fetched',
	},

	/* -------------------------------------------------------------------------- */
	/*                               oauthClient:getAll                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['oauthClient'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['oauthClient'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];
