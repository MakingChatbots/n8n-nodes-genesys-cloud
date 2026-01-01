import type { IExecuteFunctions } from 'n8n-workflow';
import { divisionOperation } from './DivisionOperation';
import * as GenericFunctions from './GenericFunctions';

describe('DivisionOperation', () => {
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
        it('should retrieve a division by id', async () => {
            const index = 0;
            const divisionId = 'test-division-id';
            const response = { id: divisionId, name: 'Test Division' };

            mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
                if (paramName === 'operation') return 'get';
                if (paramName === 'divisionId') return divisionId;
                return undefined;
            });

            jest.spyOn(GenericFunctions, 'genesysCloudApiRequest').mockResolvedValue(response);

            await divisionOperation.call(mockExecuteFunctions, index);

            expect(GenericFunctions.genesysCloudApiRequest).toHaveBeenCalledWith(
                'GET',
                `/api/v2/authorization/divisions/${divisionId}`,
            );
        });
    });

    describe('getAll', () => {
        it('should retrieve multiple divisions', async () => {
            const index = 0;
            const returnAll = true;
            const response = [{ id: '1', name: 'Div 1' }, { id: '2', name: 'Div 2' }];

            mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
                if (paramName === 'operation') return 'getAll';
                if (paramName === 'returnAll') return returnAll;
                if (paramName === 'options') return {};
                return undefined;
            });

            jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

            await divisionOperation.call(mockExecuteFunctions, index);

            expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
                'entities',
                'GET',
                '/api/v2/authorization/divisions',
                {},
                {},
                0,
            );
        });

        it('should retrieve multiple divisions with limit', async () => {
            const index = 0;
            const returnAll = false;
            const limit = 10;
            const response = [{ id: '1', name: 'Div 1' }];

            mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
                if (paramName === 'operation') return 'getAll';
                if (paramName === 'returnAll') return returnAll;
                if (paramName === 'limit') return limit;
                if (paramName === 'options') return {};
                return undefined;
            });

            jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

            await divisionOperation.call(mockExecuteFunctions, index);

            expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
                'entities',
                'GET',
                '/api/v2/authorization/divisions',
                {},
                {},
                limit,
            );
        });

        it('should filter divisions by name', async () => {
            const index = 0;
            const returnAll = true;
            const name = 'TestDiv';
            const response = [{ id: '1', name: 'TestDiv' }];

            mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
                if (paramName === 'operation') return 'getAll';
                if (paramName === 'returnAll') return returnAll;
                if (paramName === 'options') return { name };
                return undefined;
            });

            jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

            await divisionOperation.call(mockExecuteFunctions, index);

            expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
                'entities',
                'GET',
                '/api/v2/authorization/divisions',
                {},
                { name },
                0,
            );
        });

        it('should filter divisions by ids', async () => {
            const index = 0;
            const returnAll = true;
            const id = '1,2';
            const response = [{ id: '1', name: 'Div 1' }, { id: '2', name: 'Div 2' }];

            mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
                if (paramName === 'operation') return 'getAll';
                if (paramName === 'returnAll') return returnAll;
                if (paramName === 'options') return { id };
                return undefined;
            });

            jest.spyOn(GenericFunctions, 'genesysCloudApiRequestAllItems').mockResolvedValue(response);

            await divisionOperation.call(mockExecuteFunctions, index);

            expect(GenericFunctions.genesysCloudApiRequestAllItems).toHaveBeenCalledWith(
                'entities',
                'GET',
                '/api/v2/authorization/divisions',
                {},
                { id: ['1', '2'] },
                0,
            );
        });
    });
});
