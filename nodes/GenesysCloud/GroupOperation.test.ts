import type { IExecuteFunctions } from 'n8n-workflow';
import { groupOperation } from './GroupOperation';
import * as GenericFunctions from './GenericFunctions';

describe('GroupOperation', () => {
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
		it('should get a single group by ID', async () => {
			const index = 0;
			const groupId = 'test-group-id';
			const mockGroup = {
				id: groupId,
				name: 'Test Group',
				type: 'official',
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'get';
				if (paramName === 'groupId') return groupId;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequest').mockResolvedValue(mockGroup);

			await groupOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
				'GET',
				`/api/v2/groups/${groupId}`,
			);
		});

		it('should handle errors when getting a group', async () => {
			const index = 0;
			const groupId = 'invalid-group-id';
			const error = new Error('Group not found');

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'get';
				if (paramName === 'groupId') return groupId;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequest').mockRejectedValue(error);

			await expect(groupOperation.call(mockExecuteFunctions, index)).rejects.toThrow(
				'Group not found',
			);
		});
	});

	describe('getAll', () => {
		it('should get all groups without options', async () => {
			const index = 0;
			const mockGroups = [
				{ id: 'group1', name: 'Group 1' },
				{ id: 'group2', name: 'Group 2' },
			];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'options') return {};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(
				mockGroups,
			);

			await groupOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/groups',
				{},
				{},
				0,
			);
		});

		it('should pass sortOrder option to query string', async () => {
			const index = 0;
			const mockGroups = [
				{ id: 'group1', name: 'Group A' },
				{ id: 'group2', name: 'Group B' },
			];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'options')
					return {
						sortOrder: 'DESC',
					};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(
				mockGroups,
			);

			await groupOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/groups',
				{},
				{
					sortOrder: 'DESC',
				},
				0,
			);
		});

		it('should respect limit parameter', async () => {
			const index = 0;
			const limit = 25;
			const mockGroups = [{ id: 'group1', name: 'Group 1' }];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return false;
				if (paramName === 'limit') return limit;
				if (paramName === 'options') return {};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(
				mockGroups,
			);

			await groupOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/groups',
				{},
				{},
				limit,
			);
		});

		it('should use returnAll with limit 0', async () => {
			const index = 0;

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'options') return {};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue([]);

			await groupOperation.call(mockExecuteFunctions, index);

			const callArgs = (GenericFunctions.genesysCloudApiRequestAllItems as jest.Mock).mock
				.calls[0];
			const limitArg = callArgs[5];

			expect(limitArg).toBe(0);
		});

		it('should pass multiple options to query string', async () => {
			const index = 0;

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'options')
					return {
						sortOrder: 'ASC',
						type: 'official',
					};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue([]);

			await groupOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'entities',
				'GET',
				'/api/v2/groups',
				{},
				{
					sortOrder: 'ASC',
					type: 'official',
				},
				0,
			);
		});
	});

	describe('edge cases', () => {
		it('should return empty array for unknown operation', async () => {
			const index = 0;

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'unknownOperation';
				return undefined;
			});

			const result = await groupOperation.call(mockExecuteFunctions, index);

			expect(result).toEqual([]);
		});
	});
});