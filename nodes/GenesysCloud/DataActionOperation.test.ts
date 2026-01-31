import type { IExecuteFunctions } from 'n8n-workflow';
import { dataActionOperation } from './DataActionOperation';
import * as GenericFunctions from './GenericFunctions';

describe('DataActionOperation', () => {
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
		it('should fetch a single data action by ID', async () => {
			const index = 0;
			const actionId = 'test-action-id';
			const response = { id: actionId, name: 'Test Action' };

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'get';
				if (paramName === 'actionId') return actionId;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequest').mockResolvedValue(response);

			await dataActionOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
				'GET',
				`/api/v2/integrations/actions/${actionId}`,
			);
		});
	});

	describe('getAll', () => {
		it('should fetch all data actions when returnAll is true', async () => {
			const index = 0;
			const returnAll = true;
			const response = [
				{ id: 'action-1', name: 'Action 1' },
				{ id: 'action-2', name: 'Action 2' },
			];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return returnAll;
				if (paramName === 'options') return {};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

			await dataActionOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/integrations/actions',
				{},
				{},
				0,
			);
		});

		it('should respect limit when returnAll is false', async () => {
			const index = 0;
			const returnAll = false;
			const limit = 10;
			const response = [{ id: 'action-1', name: 'Action 1' }];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return returnAll;
				if (paramName === 'limit') return limit;
				if (paramName === 'options') return {};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

			await dataActionOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/integrations/actions',
				{},
				{},
				limit,
			);
		});

		it('should pass options to query string', async () => {
			const index = 0;
			const returnAll = false;
			const limit = 10;
			const options = {
				category: 'test-category',
				secure: 'true',
				sortBy: 'name',
				sortOrder: 'asc',
			};
			const response = [{ id: 'action-1', name: 'Action 1' }];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return returnAll;
				if (paramName === 'limit') return limit;
				if (paramName === 'options') return options;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

			await dataActionOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/integrations/actions',
				{},
				options,
				limit,
			);
		});
	});

	describe('getIntegrations', () => {
		it('should fetch all integrations when returnAll is true', async () => {
			const index = 0;
			const returnAll = true;
			const response = [
				{ id: 'integration-1', name: 'Integration 1' },
				{ id: 'integration-2', name: 'Integration 2' },
			];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getIntegrations';
				if (paramName === 'returnAll') return returnAll;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

			await dataActionOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/integrations',
				{},
				{},
				0,
			);
		});

		it('should respect limit when returnAll is false', async () => {
			const index = 0;
			const returnAll = false;
			const limit = 10;
			const response = [{ id: 'integration-1', name: 'Integration 1' }];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getIntegrations';
				if (paramName === 'returnAll') return returnAll;
				if (paramName === 'limit') return limit;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

			await dataActionOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/integrations',
				{},
				{},
				limit,
			);
		});
	});
});
