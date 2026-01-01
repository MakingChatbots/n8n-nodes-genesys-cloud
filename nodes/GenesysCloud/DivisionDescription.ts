import type { INodeProperties } from 'n8n-workflow';

export const divisionOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['division'],
            },
        },
        options: [
            {
                name: 'Get',
                value: 'get',
                description: 'Get a division',
                action: 'Get a division',
            },
            {
                name: 'Get Many',
                value: 'getAll',
                description: 'Get many divisions',
                action: 'Get many divisions',
            },
        ],
        default: 'get',
    },
];

export const divisionFields: INodeProperties[] = [
    /* -------------------------------------------------------------------------- */
    /*                                division:get                                */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Division ID',
        name: 'divisionId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
            show: {
                resource: ['division'],
                operation: ['get'],
            },
        },
        description: 'The ID of the division to retrieve',
    },

    /* -------------------------------------------------------------------------- */
    /*                                division:getAll                             */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['division'],
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
                resource: ['division'],
                operation: ['getAll'],
                returnAll: [false],
            },
        },
        typeOptions: {
            minValue: 1,
            maxValue: 500,
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
                resource: ['division'],
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
                        value: 'ascending',
                    },
                    {
                        name: 'Descending',
                        value: 'descending',
                    },
                ],
                default: 'ascending',
            },
            {
                displayName: 'Division IDs',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Include only divisions with the specified IDs (comma-separated)',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'Search term to filter by division name',
            },
        ],
    },
];
