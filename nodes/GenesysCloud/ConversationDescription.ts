import type { INodeProperties } from 'n8n-workflow';

export const conversationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a conversation',
				action: 'Get a conversation',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many active conversations',
				action: 'Get many conversations',
			},
		],
		default: 'get',
	},
];

export const conversationFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                conversation:get                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['get'],
			},
		},
		description: 'The ID of the conversation',
	},

	/* -------------------------------------------------------------------------- */
	/*                                conversation:getAll                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['conversation'],
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
				resource: ['conversation'],
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
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['getAll'],
			},
		},
		description: 'The start date and time for the query range',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['getAll'],
			},
		},
		description: 'The end date and time for the query range',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Order',
				name: 'order',
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
				description: 'Sort order for results',
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'options',
				options: [
					{
						name: 'Conversation Start',
						value: 'conversationStart',
					},
					{
						name: 'Conversation End',
						value: 'conversationEnd',
					},
					{
						name: 'Segment Start',
						value: 'segmentStart',
					},
					{
						name: 'Segment End',
						value: 'segmentEnd',
					},
				],
				default: 'conversationStart',
				description: 'Which field to sort results by',
			},
			{
				displayName: 'Segment Filters',
				name: 'segmentFilters',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				placeholder: 'Add Filter',
				default: {},
				description: 'Filter conversations by specific dimensions',
				options: [
					{
						displayName: 'Filters',
						name: 'filters',
						values: [
							{
								displayName: 'Dimension',
								name: 'dimension',
								type: 'options',
								options: [
									{
										name: 'Direction',
										value: 'direction',
										description: 'Inbound or outbound conversation',
									},
									{
										name: 'Media Type',
										value: 'mediaType',
										description: 'Type of media (voice, chat, email, etc.)',
									},
									{
										name: 'Queue ID',
										value: 'queueId',
										description: 'The queue that handled the conversation',
									},
									{
										name: 'User ID',
										value: 'userId',
										description: 'The user (agent) involved in the conversation',
									},
									{
										name: 'Wrap-up Code',
										value: 'wrapUpCode',
										description: 'The wrap-up code applied to the conversation',
									},
								],
								default: 'mediaType',
								description: 'The dimension to filter by',
							},
							{
								displayName: 'Operator',
								name: 'operator',
								type: 'options',
								options: [
									{
										name: 'Matches',
										value: 'matches',
										description: 'Dimension equals the specified value',
									},
									{
										name: 'Exists',
										value: 'exists',
										description: 'Dimension has any value',
									},
									{
										name: 'Not Exists',
										value: 'notExists',
										description: 'Dimension has no value',
									},
								],
								default: 'matches',
								description: 'How to compare the dimension',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								displayOptions: {
									show: {
										operator: ['matches'],
									},
								},
								description:
									'The value to match against. For Media Type use: voice, chat, email, callback, message, screenshare, cobrowse, video. For Direction use: inbound, outbound.',
							},
						],
					},
				],
			},
		],
	},
];
