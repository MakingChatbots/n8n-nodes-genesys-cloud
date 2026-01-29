import type { IExecuteFunctions } from 'n8n-workflow';
import { conversationOperation } from './ConversationOperation';
import * as GenericFunctions from './GenericFunctions';

describe('ConversationOperation', () => {
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
		it('should get a single conversation by ID', async () => {
			const index = 0;
			const conversationId = 'test-conversation-id';
			const mockConversation = {
				id: conversationId,
				startTime: '2024-01-01T00:00:00Z',
				participants: [],
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'get';
				if (paramName === 'conversationId') return conversationId;
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequest').mockResolvedValue(
				mockConversation,
			);

			await conversationOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
				'GET',
				`/api/v2/conversations/${conversationId}`,
				{},
				{},
			);
		});
	});

	describe('getAll', () => {
		it('should query conversations with date range only', async () => {
			const index = 0;
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';
			const mockConversations = [
				{ conversationId: 'conv1', conversationStart: '2024-01-15T10:00:00Z' },
				{ conversationId: 'conv2', conversationStart: '2024-01-20T14:30:00Z' },
			];

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(
				mockConversations,
			);

			await conversationOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'conversations',
				'POST',
				'/api/v2/analytics/conversations/details/query',
				{
					interval: `${startDate}/${endDate}`,
				},
				{},
				0,
				'body',
			);
		});

		it('should apply sorting options', async () => {
			const index = 0;
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options')
					return {
						order: 'desc',
						orderBy: 'conversationStart',
					};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue([]);

			await conversationOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'conversations',
				'POST',
				'/api/v2/analytics/conversations/details/query',
				{
					interval: `${startDate}/${endDate}`,
					order: 'desc',
					orderBy: 'conversationStart',
				},
				{},
				0,
				'body',
			);
		});

		it('should apply segment filters with matches operator', async () => {
			const index = 0;
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options')
					return {
						segmentFilters: {
							filters: [
								{
									dimension: 'queueId',
									operator: 'matches',
									value: 'queue-123',
								},
								{
									dimension: 'mediaType',
									operator: 'matches',
									value: 'voice',
								},
							],
						},
					};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue([]);

			await conversationOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'conversations',
				'POST',
				'/api/v2/analytics/conversations/details/query',
				{
					interval: `${startDate}/${endDate}`,
					segmentFilters: [
						{
							type: 'and',
							predicates: [
								{
									type: 'dimension',
									dimension: 'queueId',
									operator: 'matches',
									value: 'queue-123',
								},
								{
									type: 'dimension',
									dimension: 'mediaType',
									operator: 'matches',
									value: 'voice',
								},
							],
						},
					],
				},
				{},
				0,
				'body',
			);
		});

		it('should apply segment filters without value for non-matches operators', async () => {
			const index = 0;
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options')
					return {
						segmentFilters: {
							filters: [
								{
									dimension: 'queueId',
									operator: 'exists',
								},
							],
						},
					};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue([]);

			await conversationOperation.call(mockExecuteFunctions, index);

			const callArgs = (GenericFunctions.genesysCloudApiRequestAllItems as jest.Mock).mock
				.calls[0];
			const body = callArgs[3];

			expect(body.segmentFilters[0].predicates[0]).toEqual({
				type: 'dimension',
				dimension: 'queueId',
				operator: 'exists',
			});
			expect(body.segmentFilters[0].predicates[0].value).toBeUndefined();
		});

		it('should respect limit parameter', async () => {
			const index = 0;
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';
			const limit = 50;

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return false;
				if (paramName === 'limit') return limit;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue([]);

			await conversationOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'conversations',
				'POST',
				'/api/v2/analytics/conversations/details/query',
				{
					interval: `${startDate}/${endDate}`,
				},
				{},
				limit,
				'body',
			);
		});

		it('should use body pagination', async () => {
			const index = 0;
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options') return {};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue([]);

			await conversationOperation.call(mockExecuteFunctions, index);

			const callArgs = (GenericFunctions.genesysCloudApiRequestAllItems as jest.Mock).mock
				.calls[0];
			const paginationType = callArgs[6];

			expect(paginationType).toBe('body');
		});

		it('should handle empty segment filters', async () => {
			const index = 0;
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options')
					return {
						segmentFilters: {
							filters: [],
						},
					};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue([]);

			await conversationOperation.call(mockExecuteFunctions, index);

			const callArgs = (GenericFunctions.genesysCloudApiRequestAllItems as jest.Mock).mock
				.calls[0];
			const body = callArgs[3];

			expect(body.segmentFilters).toBeUndefined();
		});

		it('should combine sorting and segment filters', async () => {
			const index = 0;
			const startDate = '2024-01-01T00:00:00Z';
			const endDate = '2024-01-31T23:59:59Z';

			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				if (paramName === 'operation') return 'getAll';
				if (paramName === 'returnAll') return true;
				if (paramName === 'startDate') return startDate;
				if (paramName === 'endDate') return endDate;
				if (paramName === 'options')
					return {
						order: 'asc',
						orderBy: 'conversationStart',
						segmentFilters: {
							filters: [
								{
									dimension: 'direction',
									operator: 'matches',
									value: 'inbound',
								},
							],
						},
					};
				return undefined;
			});

			jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue([]);

			await conversationOperation.call(mockExecuteFunctions, index);

			expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
				'conversations',
				'POST',
				'/api/v2/analytics/conversations/details/query',
				{
					interval: `${startDate}/${endDate}`,
					order: 'asc',
					orderBy: 'conversationStart',
					segmentFilters: [
						{
							type: 'and',
							predicates: [
								{
									type: 'dimension',
									dimension: 'direction',
									operator: 'matches',
									value: 'inbound',
								},
							],
						},
					],
				},
				{},
				0,
				'body',
			);
		});
	});
});