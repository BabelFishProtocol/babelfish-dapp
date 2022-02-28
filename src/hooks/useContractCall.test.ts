import { ContractTransaction } from 'ethers';
import { renderHook, act } from '@testing-library/react-hooks';

import { useContractCall } from './useContractCall';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useContractCall', () => {
  it('updates status correctly', async () => {
    const mockTxReceipt = { testTxReceipt: true };
    const mockTx = {
      wait: jest.fn().mockReturnValue(mockTxReceipt),
    } as unknown as ContractTransaction;

    const submitFunction = jest
      .fn<Promise<ContractTransaction>, [{}]>()
      .mockImplementation(async () => mockTx);

    const { result } = renderHook(() => useContractCall(submitFunction));
    expect(result.current.status).toBe('idle');

    const promise = act(() => result.current.handleSubmit({}));
    expect(result.current.status).toBe('loading');

    await promise;
    expect(result.current.status).toBe('success');

    expect(mockTx.wait).toHaveBeenCalled();

    expect(result.current.tx).toEqual(mockTx);
    expect(result.current.txReceipt).toEqual(mockTxReceipt);

    act(() => result.current.onClose());
    expect(result.current.status).toBe('idle');

    expect(result.current.tx).toBeUndefined();
    expect(result.current.txReceipt).toBeUndefined();
  });
});
