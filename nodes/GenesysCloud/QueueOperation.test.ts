import type { IExecuteFunctions } from 'n8n-workflow';
import { queueOperation } from './QueueOperation';
import * as GenericFunctions from './GenericFunctions';

describe('QueueOperation', () => {
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

    describe('create', () => {
        it('should create a queue with required fields', async () => {
            const index = 0;
            const queueId = 'test-queue-id';
            const name = 'Test Queue';

            mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
                if (paramName === 'operation') return 'create';
                if (paramName === 'name') return name;
                if (paramName === 'description') return '';
                if (paramName === 'divisionId') return '';
                if (paramName === 'additionalFields') return {};
                return undefined;
            });

            jest.spyOn(GenericFunctions, 'genesysCloudApiRequest').mockResolvedValue({ id: queueId, name });

            await queueOperation.call(mockExecuteFunctions, index);

            expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
                'POST',
                '/api/v2/routing/queues',
                { name },
            );
        });

        it('should create a queue with all fields', async () => {
            const index = 0;
            const queueId = 'test-queue-id';
            const name = 'Test Queue';
            const description = 'Test Description';
            const divisionId = 'test-division-id';
            const additionalFields = {
                acwSettings: { wrapupPrompt: 'OPTIONAL' },
            };

            mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
                if (paramName === 'operation') return 'create';
                if (paramName === 'name') return name;
                if (paramName === 'description') return description;
                if (paramName === 'divisionId') return divisionId;
                if (paramName === 'additionalFields') return additionalFields;
                return undefined;
            });

            jest.spyOn(GenericFunctions, 'genesysCloudApiRequest').mockResolvedValue({ id: queueId, name, description });

            await queueOperation.call(mockExecuteFunctions, index);

            expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
                'POST',
                '/api/v2/routing/queues',
                {
                    name,
                    description,
                    division: { id: divisionId },
                    acwSettings: { wrapupPrompt: 'OPTIONAL' },
                },
            );
        });
    });
});
