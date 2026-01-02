import type { IExecuteFunctions } from 'n8n-workflow';
import { userOperation } from './UserOperation';
import * as GenericFunctions from './GenericFunctions';

describe('UserOperation', () => {
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

    describe('getQueues', () => {
        it('should retrieve queues for a user', async () => {
            const index = 0;
            const userId = 'test-user-id';
            const returnAll = true;
            const response = [{ id: 'queue-1', name: 'Queue 1' }];

            mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
                if (paramName === 'operation') return 'getQueues';
                if (paramName === 'userId') return userId;
                if (paramName === 'returnAll') return returnAll;
                return undefined;
            });

            jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

            await userOperation.call(mockExecuteFunctions, index);

            expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
                'entities',
                'GET',
                `/api/v2/users/${userId}/queues`,
                {},
                {},
                0,
            );
        });

        it('should retrieve queues for a user with limit', async () => {
            const index = 0;
            const userId = 'test-user-id';
            const returnAll = false;
            const limit = 5;
            const response = [{ id: 'queue-1', name: 'Queue 1' }];

            mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
                if (paramName === 'operation') return 'getQueues';
                if (paramName === 'userId') return userId;
                if (paramName === 'returnAll') return returnAll;
                if (paramName === 'limit') return limit;
                return undefined;
            });

            jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

            await userOperation.call(mockExecuteFunctions, index);

            expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
                'entities',
                'GET',
                `/api/v2/users/${userId}/queues`,
                {},
                {},
                limit,
            );
        });
    });
});
