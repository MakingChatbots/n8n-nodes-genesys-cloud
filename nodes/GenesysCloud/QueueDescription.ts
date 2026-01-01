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
				name: 'Create',
				value: 'create',
				description: 'Create a queue',
				action: 'Create a queue',
			},
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
	/*                                  queue:create                              */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['create'],
			},
		},
		description: 'The queue name',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['create'],
			},
		},
		description: 'The queue description',
	},
	{
		displayName: 'Division ID',
		name: 'divisionId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['create'],
			},
		},
		description: 'The division ID to which this queue will belong',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Agent Owned Routing',
				name: 'agentOwnedRouting',
				type: 'json',
				default: '',
				description: 'Agent owned routing settings',
			},
			{
				displayName: 'Auto Answer Only',
				name: 'autoAnswerOnly',
				type: 'boolean',
				default: true,
				description: 'Whether to only allow auto-answer',
			},
			{
				displayName: 'Bullseye',
				name: 'bullseye',
				type: 'json',
				default: '',
				description: 'Bullseye routing settings',
			},
			{
				displayName: 'Canned Response Libraries',
				name: 'cannedResponseLibraries',
				type: 'json',
				default: '',
				description: 'Canned response libraries settings',
			},
			{
				displayName: 'Conditional Group Routing',
				name: 'conditionalGroupRouting',
				type: 'json',
				default: '',
				description: 'Conditional group routing settings',
			},
			{
				displayName: 'Default Scripts',
				name: 'defaultScripts',
				type: 'json',
				default: '',
				description: 'Default scripts settings',
			},
			{
				displayName: 'Direct Routing',
				name: 'directRouting',
				type: 'json',
				default: '',
				description: 'Direct routing settings',
			},
			{
				displayName: 'Email In Queue Flow',
				name: 'emailInQueueFlow',
				type: 'string',
				default: '',
				description: 'ID of the in-queue flow for email',
			},
			{
				displayName: 'Enable Audio Monitoring',
				name: 'enableAudioMonitoring',
				type: 'boolean',
				default: true,
				description: 'Whether to enable audio monitoring',
			},
			{
				displayName: 'Enable Manual Assignment',
				name: 'enableManualAssignment',
				type: 'boolean',
				default: true,
				description: 'Whether to enable manual assignment',
			},
			{
				displayName: 'Enable Transcription',
				name: 'enableTranscription',
				type: 'boolean',
				default: true,
				description: 'Whether to enable transcription',
			},
			{
				displayName: 'Media Settings',
				name: 'mediaSettings',
				type: 'json',
				default: '',
			},
			{
				displayName: 'Message In Queue Flow',
				name: 'messageInQueueFlow',
				type: 'string',
				default: '',
				description: 'ID of the in-queue flow for messages',
			},
			{
				displayName: 'On Hold Prompt',
				name: 'onHoldPrompt',
				type: 'string',
				default: '',
				description: 'ID of the on-hold prompt',
			},
			{
				displayName: 'Outbound Email Address',
				name: 'outboundEmailAddress',
				type: 'json',
				default: '',
				description: 'Outbound email address settings',
			},
			{
				displayName: 'Outbound Messaging Addresses',
				name: 'outboundMessagingAddresses',
				type: 'json',
				default: '',
				description: 'Outbound messaging addresses settings',
			},
			{
				displayName: 'Queue Flow',
				name: 'queueFlow',
				type: 'string',
				default: '',
				description: 'ID of the queue flow',
			},
			{
				displayName: 'Routing Rules',
				name: 'routingRules',
				type: 'json',
				default: '[]',
				description: 'The routing rules for the queue',
			},
			{
				displayName: 'Scoring Method',
				name: 'scoringMethod',
				type: 'options',
				options: [
					{
						name: 'Timestamp And Priority',
						value: 'TimestampAndPriority',
					},
					{
						name: 'Priority Only',
						value: 'PriorityOnly',
					},
				],
				default: 'TimestampAndPriority',
				description: 'The scoring method for the queue',
			},
			{
				displayName: 'Skill Evaluation Method',
				name: 'skillEvaluationMethod',
				type: 'options',
				options: [
					{
						name: 'None',
						value: 'NONE',
					},
					{
						name: 'Best',
						value: 'BEST',
					},
					{
						name: 'All',
						value: 'ALL',
					},
				],
				default: 'NONE',
				description: 'The skill evaluation method for the queue',
			},
			{
				displayName: 'Suppress In Queue Call Recording',
				name: 'suppressInQueueCallRecording',
				type: 'boolean',
				default: true,
				description: 'Whether to suppress call recording in queue',
			},
			{
				displayName: 'Whisper Prompt',
				name: 'whisperPrompt',
				type: 'string',
				default: '',
				description: 'ID of the whisper prompt',
			},
		],
	},

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
