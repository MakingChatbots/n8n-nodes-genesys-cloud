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
			{
				name: 'Get Usage',
				value: 'getUsage',
				description: 'Get usage statistics for an OAuth client',
				action: 'Get usage statistics for oauth client',
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
				operation: ['get', 'getUsage'],
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

	/* -------------------------------------------------------------------------- */
	/*                              oauthClient:getUsage                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oauthClient'],
				operation: ['getUsage'],
			},
		},
		description: 'Start date for usage query (ISO 8601 format, e.g., 2024-01-01T00:00:00Z)',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oauthClient'],
				operation: ['getUsage'],
			},
		},
		description: 'End date for usage query (ISO 8601 format, e.g., 2024-01-31T23:59:59Z)',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['oauthClient'],
				operation: ['getUsage'],
			},
		},
		options: [
			{
				displayName: 'Granularity',
				name: 'granularity',
				type: 'options',
				default: 'Day',
				options: [
					{
						name: 'Day',
						value: 'Day',
					},
					{
						name: 'Week',
						value: 'Week',
					},
					{
						name: 'Month',
						value: 'Month',
					},
				],
				description: 'Time granularity for grouping usage data',
			},
			{
				displayName: 'Metrics',
				name: 'metrics',
				type: 'multiOptions',
				default: ['Requests'],
				options: [
					{
						name: 'Requests',
						value: 'Requests',
					},
					{
						name: 'Status 200',
						value: 'Status200',
					},
					{
						name: 'Status 300',
						value: 'Status300',
					},
					{
						name: 'Status 400',
						value: 'Status400',
					},
					{
						name: 'Status 429',
						value: 'Status429',
					},
					{
						name: 'Status 500',
						value: 'Status500',
					},
				],
				description: 'Metrics to include in the usage data',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'multiOptions',
				default: ['TemplateUri', 'HttpMethod'],
				options: [
					{
						name: 'OAuth Client ID',
						value: 'OAuthClientId',
					},
					{
						name: 'Organization ID',
						value: 'OrganizationId',
					},
					{
						name: 'Template URI',
						value: 'TemplateUri',
					},
					{
						name: 'HTTP Method',
						value: 'HttpMethod',
					},
				],
				description: 'Dimensions to group usage data by',
			},
		],
	},
];
