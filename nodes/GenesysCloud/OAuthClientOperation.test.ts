import type { IDataObject, IExecuteFunctions, INode } from 'n8n-workflow';
import { oauthClientOperation } from './OAuthClientOperation';
import * as GenericFunctions from './GenericFunctions';

describe('OAuthClientOperation', () => {
	const mockNode: INode = {
		id: 'test-node-id',
		name: 'Test Node',
		type: 'n8n-nodes-base.genesysCloud',
		typeVersion: 1,
		position: [0, 0],
		parameters: {},
	};

	const mockExecuteFunctions = {
		getNodeParameter: jest.fn(),
		getNode: jest.fn().mockReturnValue(mockNode),
		helpers: {
			constructExecutionMetaData: jest.fn().mockImplementation((data) => data),
			returnJsonArray: jest.fn().mockImplementation((data) => (Array.isArray(data) ? data : [data])),
		},
	} as unknown as IExecuteFunctions & {
		getNodeParameter: jest.Mock;
		getNode: jest.Mock;
		helpers: {
			constructExecutionMetaData: jest.Mock;
			returnJsonArray: jest.Mock;
		};
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('get', () => {
		it('should get a single OAuth client by ID', async () => {
			const index = 0;
			const oauthClientId = 'test-client-id';
			const mockResponse = {
				id: oauthClientId,
				name: 'Test OAuth Client',
				accessTokenValiditySeconds: 3600,
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'get';
				if (paramName === 'oauthClientId') return oauthClientId;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequest').mockResolvedValue(mockResponse);

			const result = await oauthClientOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
				'GET',
				`/api/v2/oauth/clients/${oauthClientId}`,
			);
			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.constructExecutionMetaData).toHaveBeenCalledWith(
				[mockResponse],
				{ itemData: { item: index } },
			);
		});
	});

	describe('getAll', () => {
		it('should get all OAuth clients when returnAll is true', async () => {
			const index = 0;
			const mockResponse = [
				{ id: 'client-1', name: 'Client 1' },
				{ id: 'client-2', name: 'Client 2' },
			];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(mockResponse);

			const result = await oauthClientOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/oauth/clients',
				{},
				{},
				0,
			);
			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.constructExecutionMetaData).toHaveBeenCalledWith(
				mockResponse,
				{ itemData: { item: index } },
			);
		});

		it('should get limited OAuth clients when returnAll is false', async () => {
			const index = 0;
			const limit = 25;
			const mockResponse = [
				{ id: 'client-1', name: 'Client 1' },
			];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return false;
				if (paramName === 'limit') return limit;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(mockResponse);

			const result = await oauthClientOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/oauth/clients',
				{},
				{},
				limit,
			);
			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.constructExecutionMetaData).toHaveBeenCalledWith(
				mockResponse,
				{ itemData: { item: index } },
			);
		});
	});

	describe('getUsage', () => {
		it('should successfully retrieve usage data', async () => {
			const index = 0;
			const oauthClientId = 'test-client-id';
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getUsage';
				if (paramName === 'oauthClientId') return oauthClientId;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			const mockExecutionResult = { executionId: 'test-exec-id' };
			const mockQueryResultRunning = { queryStatus: 'Running' };
			const mockQueryResultComplete = {
				queryStatus: 'Complete',
				results: [
					{ httpMethod: 'GET', templateUri: '/api/v2/users', requests: 100 },
					{ httpMethod: 'POST', templateUri: '/api/v2/conversations', requests: 50 },
				],
			};

			jest
				.spyOn(GenericFunctions, 'genesysCloudApiRequest')
				.mockResolvedValueOnce(mockExecutionResult)
				.mockResolvedValueOnce(mockQueryResultRunning)
				.mockResolvedValueOnce(mockQueryResultComplete);

			const result = await oauthClientOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
				'POST',
				`/api/v2/oauth/clients/${oauthClientId}/usage/query`,
				{
					interval: `${startDate}/${endDate}`,
					metrics: ['Requests'],
					groupBy: ['TemplateUri', 'HttpMethod'],
				},
			);

			expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
				'GET',
				`/api/v2/oauth/clients/${oauthClientId}/usage/query/results/test-exec-id`,
			);

			expect(result).toBeDefined();
			const responseData = result[0] as IDataObject;
			expect(responseData.startDate).toBe(startDate);
			expect(responseData.endDate).toBe(endDate);
			expect(responseData.totalRequests).toBe(150);
			expect(responseData.requestsPerEndpoint).toEqual([
				{ endpoint: 'GET /api/v2/users', requests: 100 },
				{ endpoint: 'POST /api/v2/conversations', requests: 50 },
			]);
		});

		it('should handle custom options (granularity and metrics)', async () => {
			const index = 0;
			const oauthClientId = 'test-client-id';
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getUsage';
				if (paramName === 'oauthClientId') return oauthClientId;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') {
					return {
						granularity: 'Week',
						metrics: ['Requests', 'Status200'],
						groupBy: ['OAuthClientId'],
					};
				}
				return undefined;
			});

			const mockExecutionResult = { executionId: 'test-exec-id' };
			const mockQueryResultComplete = {
				queryStatus: 'Complete',
				results: [{ httpMethod: 'GET', templateUri: '/api/v2/users', requests: 100 }],
			};

			jest
				.spyOn(GenericFunctions, 'genesysCloudApiRequest')
				.mockResolvedValueOnce(mockExecutionResult)
				.mockResolvedValueOnce(mockQueryResultComplete);

			await oauthClientOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
				'POST',
				`/api/v2/oauth/clients/${oauthClientId}/usage/query`,
				{
					interval: `${startDate}/${endDate}`,
					granularity: 'Week',
					metrics: ['Requests', 'Status200'],
					groupBy: ['OAuthClientId'],
				},
			);
		});

		it('should throw error for invalid start date', async () => {
			const index = 0;
			const invalidStartDate = 'invalid-date';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getUsage';
				if (paramName === 'oauthClientId') return 'test-client-id';
				if (paramName === 'startDate') return invalidStartDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			await expect(oauthClientOperation.call(mockExecuteFunctions, index)).rejects.toThrow(
				`Invalid start date format: "${invalidStartDate}"`,
			);
		});

		it('should throw error for invalid end date', async () => {
			const index = 0;
			const startDate = '2024-01-01T00:00:00Z';
			const invalidEndDate = 'invalid-date';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getUsage';
				if (paramName === 'oauthClientId') return 'test-client-id';
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return invalidEndDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			await expect(oauthClientOperation.call(mockExecuteFunctions, index)).rejects.toThrow(
				`Invalid end date format: "${invalidEndDate}"`,
			);
		});

		it('should throw error when start date is after end date', async () => {
			const index = 0;
			const startDate = '2024-01-31T23:59:59Z';
			const endDate = '2024-01-01T00:00:00Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getUsage';
				if (paramName === 'oauthClientId') return 'test-client-id';
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			await expect(oauthClientOperation.call(mockExecuteFunctions, index)).rejects.toThrow(
				`Start date (${startDate}) must be before end date (${endDate})`,
			);
		});

		it('should throw error when executionId is missing', async () => {
			const index = 0;
			const oauthClientId = 'test-client-id';
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getUsage';
				if (paramName === 'oauthClientId') return oauthClientId;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequest').mockResolvedValueOnce({});

			await expect(oauthClientOperation.call(mockExecuteFunctions, index)).rejects.toThrow(
				`Failed to submit usage query for OAuth client ${oauthClientId}. No executionId returned.`,
			);
		});

		it('should throw error when query status is Failed', async () => {
			const index = 0;
			const oauthClientId = 'test-client-id';
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getUsage';
				if (paramName === 'oauthClientId') return oauthClientId;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			const mockExecutionResult = { executionId: 'test-exec-id' };
			const mockQueryResultFailed = { queryStatus: 'Failed' };

			jest
				.spyOn(GenericFunctions, 'genesysCloudApiRequest')
				.mockResolvedValueOnce(mockExecutionResult)
				.mockResolvedValueOnce(mockQueryResultFailed);

			await expect(oauthClientOperation.call(mockExecuteFunctions, index)).rejects.toThrow(
				`Usage query failed for OAuth client ${oauthClientId}`,
			);
		});

		it('should throw timeout error when max attempts reached', async () => {
			const index = 0;
			const oauthClientId = 'test-client-id';
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getUsage';
				if (paramName === 'oauthClientId') return oauthClientId;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			const mockExecutionResult = { executionId: 'test-exec-id' };
			const mockQueryResultRunning = { queryStatus: 'Running' };

			const apiRequestSpy = jest
				.spyOn(GenericFunctions, 'genesysCloudApiRequest')
				.mockResolvedValueOnce(mockExecutionResult);

			// Mock 10 consecutive 'Running' responses
			for (let i = 0; i < 10; i++) {
				apiRequestSpy.mockResolvedValueOnce(mockQueryResultRunning);
			}

			await expect(oauthClientOperation.call(mockExecuteFunctions, index)).rejects.toThrow(
				`Timeout waiting for usage query to complete for OAuth client ${oauthClientId}`,
			);
		}, 35000); // Increase timeout for this test since it waits 10 * 3 seconds
	});
});
