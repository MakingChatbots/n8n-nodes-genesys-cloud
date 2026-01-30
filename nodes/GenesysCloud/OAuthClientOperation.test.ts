import type { IExecuteFunctions } from 'n8n-workflow';
import { oauthClientOperation } from './OAuthClientOperation';
import * as GenericFunctions from './GenericFunctions';

describe('OAuthClientOperation', () => {
	const mockExecuteFunctions = {
		getNodeParameter: jest.fn(),
		helpers: {
			constructExecutionMetaData: jest.fn().mockImplementation((data) => data),
			returnJsonArray: jest.fn().mockImplementation((data) => data),
		},
	} as unknown as IExecuteFunctions & {
		getNodeParameter: jest.Mock;
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
				mockResponse,
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
});
