import type { IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { genesysCloudApiRequest, genesysCloudApiRequestAllItems } from './GenericFunctions';

describe('GenericFunctions', () => {
	const mockExecuteFunctions = {
		getNode: jest.fn(),
		getCredentials: jest.fn(),
		helpers: {
			httpRequestWithAuthentication: jest.fn(),
		},
	} as unknown as IExecuteFunctions & {
		getNode: jest.Mock;
		getCredentials: jest.Mock;
		helpers: { httpRequestWithAuthentication: jest.Mock };
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(mockExecuteFunctions.helpers.httpRequestWithAuthentication as jest.Mock).mockReset();
		mockExecuteFunctions.getNode.mockReturnValue({
			id: 'test-node-id',
			name: 'genesysCloud',
			type: 'n8n-nodes-genesys-cloud.genesysCloud',
			typeVersion: 1,
			position: [0, 0],
			parameters: {},
		});
		mockExecuteFunctions.getCredentials.mockResolvedValue({
			clientId: 'test-client-id',
			clientSecret: 'test-client-secret',
			region: 'mypurecloud.com',
		});
		mockExecuteFunctions.helpers.httpRequestWithAuthentication.mockResolvedValue({});
	});

	describe('genesysCloudApiRequest', () => {
		it('should make a request with correct base URL and arguments', async () => {
			const method: IHttpRequestMethods = 'GET';
			const resource = '/api/v2/users';
			const body = { name: 'test' };
			const query = { q: 'search' };

			await genesysCloudApiRequest.call(mockExecuteFunctions, method, resource, body, query);

			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				'genesysCloudPlatformApiOAuth2Api',
				expect.objectContaining({
					method,
					url: 'https://api.mypurecloud.com/api/v2/users',
					body,
					qs: query,
					json: true,
				}),
			);
		});

		it('should handle different regions', async () => {
			mockExecuteFunctions.getCredentials.mockResolvedValue({
				region: 'mypurecloud.ie',
			});

			await genesysCloudApiRequest.call(mockExecuteFunctions, 'GET', '/test');

			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					url: 'https://api.mypurecloud.ie/test',
				}),
			);
		});
	});

	describe('genesysCloudApiRequestAllItems', () => {
		it('should paginate through results', async () => {
			const page1 = {
				entities: [{ id: 1 }, { id: 2 }],
				pageNumber: 1,
				pageCount: 2,
			};
			const page2 = {
				entities: [{ id: 3 }],
				pageNumber: 2,
				pageCount: 2,
			};

			(mockExecuteFunctions.helpers.httpRequestWithAuthentication as jest.Mock)
				.mockResolvedValueOnce(page1)
				.mockResolvedValueOnce(page2);

			const result = await genesysCloudApiRequestAllItems.call(
				mockExecuteFunctions,
				'entities',
				'GET',
				'/api/v2/users',
			);

			expect(result).toHaveLength(3);
			expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledTimes(2);
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenNthCalledWith(
				1,
				expect.any(String),
				expect.objectContaining({ qs: { pageNumber: 1 } }),
			);
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenNthCalledWith(
				2,
				expect.any(String),
				expect.objectContaining({ qs: { pageNumber: 2 } }),
			);
		});

		it('should paginate using cursors', async () => {
			const page1 = {
				entities: [{ id: 1 }],
				cursor: 'cursor-1',
			};
			const page2 = {
				entities: [{ id: 2 }],
			};

			(mockExecuteFunctions.helpers.httpRequestWithAuthentication as jest.Mock)
				.mockResolvedValueOnce(page1)
				.mockResolvedValueOnce(page2);

			const result = await genesysCloudApiRequestAllItems.call(
				mockExecuteFunctions,
				'entities',
				'GET',
				'/api/v2/users',
			);

			expect(result).toHaveLength(2);
			expect(result).toEqual([{ id: 1 }, { id: 2 }]);
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledTimes(2);
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenNthCalledWith(
				1,
				expect.any(String),
				expect.objectContaining({ qs: { pageNumber: 1 } }),
			);
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenNthCalledWith(
				2,
				expect.any(String),
				expect.objectContaining({ qs: { cursor: 'cursor-1' } }),
			);
		});

		it('should respect limit functionality', async () => {
			const page1 = {
				entities: [{ id: 1 }, { id: 2 }],
				pageNumber: 1,
				pageCount: 2,
			};
			const page2 = {
				entities: [{ id: 3 }, { id: 4 }],
				pageNumber: 2,
				pageCount: 2,
			};

			(mockExecuteFunctions.helpers.httpRequestWithAuthentication as jest.Mock)
				.mockResolvedValueOnce(page1)
				.mockResolvedValueOnce(page2);

			const result = await genesysCloudApiRequestAllItems.call(
				mockExecuteFunctions,
				'entities',
				'GET',
				'/api/v2/users',
				{},
				{},
				3, // Limit to 3 items
			);

			expect(result).toHaveLength(3);
			expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
			expect(mockExecuteFunctions.helpers.httpRequestWithAuthentication).toHaveBeenCalledTimes(2);
		});
	});
});
