import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user',
				action: 'Get a user',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many users',
				action: 'Get many users',
			},
			{
				name: 'Get Queues',
				value: 'getQueues',
				description: 'Get queues for a user',
				action: 'Get queues for a user',
			},
		],
		default: 'get',
	},
];

export const userFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                  user:get                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'getQueues'],
			},
		},
		description: 'The ID of the user',
	},

	/* -------------------------------------------------------------------------- */
	/*                                  user:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getAll', 'getQueues'],
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
				resource: ['user'],
				operation: ['getAll', 'getQueues'],
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
				resource: ['user'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{
						name: 'Ascending',
						value: 'ASC',
					},
					{
						name: 'Descending',
						value: 'DESC',
					},
					{
						name: 'Score',
						value: 'SCORE',
					},
				],
				default: 'ASC',
				description: 'The sort order for results',
			},
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
						name: 'Authorization Unused',
						value: 'authorization.unused',
					},
					{
						name: 'Biography',
						value: 'biography',
					},
					{
						name: 'Conversation Summary',
						value: 'conversationSummary',
					},
					{
						name: 'Date Last Login',
						value: 'dateLastLogin',
					},
					{
						name: 'Employer Info',
						value: 'employerInfo',
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
						value: 'lastTokenIssued',
					},
					{
						name: 'Locations',
						value: 'locations',
					},
					{
						name: 'Out of Office',
						value: 'outOfOffice',
					},
					{
						name: 'Presence',
						value: 'presence',
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
						name: 'Work Plan',
						value: 'workPlan',
					},
					{
						name: 'Work Plan Rotation',
						value: 'workPlanRotation',
					},
				],
				default: [],
				description: 'Which fields, if any, to expand',
			},
			{
				displayName: 'Integration Presence Source',
				name: 'integrationPresenceSource',
				type: 'options',
				options: [
					{
						name: 'Microsoft Teams',
						value: 'MicrosoftTeams',
					},
					{
						name: 'Zoom Phone',
						value: 'ZoomPhone',
					},
					{
						name: 'Ring Central',
						value: 'RingCentral',
					},
					{
						name: 'Genesys Cloud',
						value: 'PureCloud',
					},
				],
				default: 'PureCloud',
				description:
					'Gets an integration presence for a user with the following source. Only Valid when presence is expanded.',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Inactive',
						value: 'inactive',
					},
					{
						name: 'Deleted',
						value: 'deleted',
					},
					{
						name: 'Any',
						value: 'any',
					},
				],
				default: 'active',
				description: 'Only list users with this state',
			},
		],
	},
];
