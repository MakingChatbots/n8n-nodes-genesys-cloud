import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { GenesysCloud } from './GenesysCloud.node';
import * as QueueOperation from './QueueOperation';

describe('GenesysCloud Node', () => {
	let genesysCloudNode: GenesysCloud;

	beforeEach(() => {
		genesysCloudNode = new GenesysCloud();
		jest.clearAllMocks();
	});

	describe('Error Handling', () => {
		const mockExecuteFunctions = (continueOnFail: boolean) => {
			const inputData = [
				{ json: { test: 'data1' } },
				{ json: { test: 'data2' } },
			];
			return {
				getInputData: jest.fn().mockImplementation((index?: number) => {
					if (index !== undefined) {
						return [inputData[index]];
					}
					return inputData;
				}),
				getNodeParameter: jest.fn().mockImplementation((paramName: string, index: number) => {
					if (paramName === 'resource') return 'queue';
					if (paramName === 'operation') return 'get';
					return undefined;
				}),
				continueOnFail: jest.fn().mockReturnValue(continueOnFail),
				getNode: jest.fn().mockReturnValue({
					name: 'Genesys Cloud',
					type: 'genesysCloud',
					typeVersion: 1,
				}),
			} as unknown as IExecuteFunctions;
		};

		it('should throw error when continueOnFail is false', async () => {
			const mockFunctions = mockExecuteFunctions(false);
			const testError = new Error('API request failed');

			jest.spyOn(QueueOperation, 'queueOperation').mockRejectedValue(testError);

			await expect(genesysCloudNode.execute.call(mockFunctions)).rejects.toThrow(
				NodeOperationError,
			);
		});

		it('should return error in output when continueOnFail is true', async () => {
			const mockFunctions = mockExecuteFunctions(true);
			const testError = new Error('API request failed');

			jest.spyOn(QueueOperation, 'queueOperation').mockRejectedValue(testError);

			const result = await genesysCloudNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			expect(result[0]).toHaveLength(2);
			expect(result[0][0].error).toBe(testError);
			expect(result[0][0].json).toEqual({ test: 'data1' });
			expect(result[0][0].pairedItem).toBe(0);
			expect(result[0][1].error).toBe(testError);
			expect(result[0][1].json).toEqual({ test: 'data2' });
			expect(result[0][1].pairedItem).toBe(1);
		});

		it('should handle mixed success and failure with continueOnFail', async () => {
			const mockFunctions = mockExecuteFunctions(true);
			const testError = new Error('API request failed');

			jest
				.spyOn(QueueOperation, 'queueOperation')
				.mockImplementationOnce(() =>
					Promise.resolve([{ json: { id: 'queue1', name: 'Queue 1' }, pairedItem: 0 }]),
				)
				.mockRejectedValueOnce(testError);

			const result = await genesysCloudNode.execute.call(mockFunctions);

			expect(result).toBeDefined();
			expect(result[0]).toHaveLength(2);

			expect(result[0][0].json).toEqual({ id: 'queue1', name: 'Queue 1' });
			expect(result[0][0].error).toBeUndefined();

			expect(result[0][1].error).toBe(testError);
			expect(result[0][1].json).toEqual({ test: 'data2' });
			expect(result[0][1].pairedItem).toBe(1);
		});

		it('should preserve error context when re-throwing', async () => {
			const mockFunctions = mockExecuteFunctions(false);
			const testError = new Error('API request failed') as Error & { context?: { itemIndex?: number } };
			testError.context = { itemIndex: 5 };

			jest.spyOn(QueueOperation, 'queueOperation').mockRejectedValue(testError);

			await expect(genesysCloudNode.execute.call(mockFunctions)).rejects.toThrow(testError);
		});
	});

	describe('Resource Operations', () => {
		const mockExecuteFunctions = (resource: string, operation: string) => {
			return {
				getInputData: jest.fn().mockReturnValue([{ json: { test: 'data' } }]),
				getNodeParameter: jest.fn().mockImplementation((paramName: string, index: number) => {
					if (paramName === 'resource') return resource;
					if (paramName === 'operation') return operation;
					return undefined;
				}),
				continueOnFail: jest.fn().mockReturnValue(false),
				getNode: jest.fn().mockReturnValue({
					name: 'Genesys Cloud',
					type: 'genesysCloud',
					typeVersion: 1,
				}),
			} as unknown as IExecuteFunctions;
		};

		it('should call queueOperation for queue resource', async () => {
			const mockFunctions = mockExecuteFunctions('queue', 'get');
			const mockResult: INodeExecutionData[] = [{ json: { id: 'queue1' }, pairedItem: 0 }];

			jest.spyOn(QueueOperation, 'queueOperation').mockResolvedValue(mockResult);

			const result = await genesysCloudNode.execute.call(mockFunctions);

			expect(QueueOperation.queueOperation).toHaveBeenCalledWith(0);
			expect(result[0]).toEqual(mockResult);
		});
	});
});