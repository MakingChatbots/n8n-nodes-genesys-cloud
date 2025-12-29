import type { INodeProperties } from 'n8n-workflow';

export const queueOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['queue'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an queues',
				action: 'Get a queue',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many queues',
				action: 'Get many queues',
			},
			{
				name: 'Get Members',
				value: 'getMembers',
				description: 'Get members of a queue',
				action: 'Get members of a queue',
			},
		],
		default: 'get',
	},
];

export const queueFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                  queue:get                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Queue ID',
		name: 'queueId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['get', 'getMembers'],
			},
		},
		description: 'ID of queue that needs to be fetched',
	},

	/* -------------------------------------------------------------------------- */
	/*                                 queue:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['getAll', 'getMembers'],
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
				resource: ['queue'],
				operation: ['getAll', 'getMembers'],
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
				resource: ['queue'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Canned Response Library ID',
				name: 'cannedResponseLibraryId',
				type: 'string',
				default: '',
				description:
					'Include only queues explicitly associated with the specified canned response library ID',
			},
			{
				displayName: 'Division IDs',
				name: 'divisionId',
				type: 'string',
				default: '',
				description: 'Include only queues in the specified division IDs (comma-separated)',
			},
			{
				displayName: 'Expand',
				name: 'expand',
				type: 'multiOptions',
				options: [
					{
						name: 'Identity Resolution',
						value: 'identityresolution',
					},
				],
				default: [],
				description: 'Which fields, if any, to expand',
			},
			{
				displayName: 'Has Peer',
				name: 'hasPeer',
				type: 'boolean',
				default: false,
				description: 'Whether to include only queues with a peer ID',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description:
					'Include only queues with the given name (leading and trailing asterisks allowed)',
			},
			{
				displayName: 'Peer IDs',
				name: 'peerId',
				type: 'string',
				default: '',
				description: 'Include only queues with the specified peer IDs (comma-separated)',
			},
			{
				displayName: 'Queue IDs',
				name: 'id',
				type: 'string',
				default: '',
				description: 'Include only queues with the specified IDs (comma-separated)',
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
				description: 'Sort order for results',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                               queue:getMembers                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['getMembers'],
			},
		},
		options: [
			{
				displayName: 'Expand',
				name: 'expand',
				type: 'multiOptions',
				options: [
					{
						name: 'Authorization',
						value: 'authorization',
					},
					{
						name: 'Authorization Unused Roles',
						value: 'authorization.unusedRoles',
					},
					{
						name: 'Biography',
						value: 'biography',
					},
					{
						name: 'Certifications',
						value: 'certifications',
					},
					{
						name: 'Conversation Summary',
						value: 'conversationSummary',
					},
					{
						name: 'Custom Attributes',
						value: 'customAttributes',
					},
					{
						name: 'Date Last Login',
						value: 'dateLastLogin',
					},
					{
						name: 'Date Welcome Sent',
						value: 'dateWelcomeSent',
					},
					{
						name: 'Employer Info',
						value: 'employerInfo',
					},
					{
						name: 'External Contacts Settings',
						value: 'externalContactsSettings',
					},
					{
						name: 'Geolocation',
						value: 'geolocation',
					},
					{
						name: 'Groups',
						value: 'groups',
					},
					{
						name: 'Integration Presence',
						value: 'integrationPresence',
					},
					{
						name: 'Language Preference',
						value: 'languagePreference',
					},
					{
						name: 'Languages',
						value: 'languages',
					},
					{
						name: 'Last Token Issued',
						value: 'lasttokenissued',
					},
					{
						name: 'Locations',
						value: 'locations',
					},
					{
						name: 'Out Of Office',
						value: 'outOfOffice',
					},
					{
						name: 'Presence',
						value: 'presence',
					},
					{
						name: 'Profile Skills',
						value: 'profileSkills',
					},
					{
						name: 'Routing Status',
						value: 'routingStatus',
					},
					{
						name: 'Skills',
						value: 'skills',
					},
					{
						name: 'Station',
						value: 'station',
					},
					{
						name: 'Team',
						value: 'team',
					},
					{
						name: 'Work Plan Bid Ranks',
						value: 'workPlanBidRanks',
					},
				],
				default: [],
				description: 'Which fields, if any, to expand',
			},
		],
	},
];
