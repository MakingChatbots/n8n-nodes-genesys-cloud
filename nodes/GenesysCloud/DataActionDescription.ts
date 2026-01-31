import type { INodeProperties } from 'n8n-workflow';

export const dataActionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dataAction'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a data action',
				action: 'Get a data action',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many data actions',
				action: 'Get many data actions',
			},
			{
				name: 'Get Integrations',
				value: 'getIntegrations',
				description: 'Get integrations for filtering data actions',
				action: 'Get integrations',
			},
		],
		default: 'get',
	},
];

export const dataActionFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                dataAction:get                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Action ID',
		name: 'actionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['dataAction'],
				operation: ['get'],
			},
		},
		description: 'ID of the data action',
	},

	/* -------------------------------------------------------------------------- */
	/*                               dataAction:getAll                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['dataAction'],
				operation: ['getAll', 'getIntegrations'],
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
				resource: ['dataAction'],
				operation: ['getAll', 'getIntegrations'],
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
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['dataAction'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Action IDs',
				name: 'ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of action IDs (max 50)',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Filter by category name',
			},
			{
				displayName: 'Include Auth Actions',
				name: 'includeAuthActions',
				type: 'boolean',
				default: false,
				description: 'Whether to include authentication actions',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by partial or complete action name',
			},
			{
				displayName: 'Secure',
				name: 'secure',
				type: 'options',
				options: [
					{
						name: 'Any',
						value: 'any',
					},
					{
						name: 'True',
						value: 'true',
					},
					{
						name: 'False',
						value: 'false',
					},
				],
				default: 'any',
				description: 'Filter secure vs non-secure actions',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'string',
				default: '',
				description: 'Root level field name to sort on',
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{
						name: 'Ascending',
						value: 'asc',
					},
					{
						name: 'Descending',
						value: 'desc',
					},
				],
				default: 'asc',
				description: 'Sort direction',
			},
		],
	},
];
