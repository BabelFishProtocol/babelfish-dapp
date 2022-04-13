import { TransactionReceipt } from '@ethersproject/providers';
import { ContractTransaction } from 'ethers';
import { CallState } from '../types';

export const initialCallState: CallState<'step1' | 'step2'> = {
  status: 'idle',
  steps: [{ name: 'step1' }, { name: 'step2' }],
};

export const populatedCallState: CallState<'step1' | 'step2'> = {
  status: 'success',
  currentOperation: 'step1',
  steps: [
    {
      name: 'step1',
      tx: { hash: '0x01' } as ContractTransaction,
      txReceipt: {
        transactionHash: '0x01',
        confirmations: 2,
      } as TransactionReceipt,
    },
    {
      name: 'step2',
      tx: { hash: '0x02' } as ContractTransaction,
      txReceipt: {
        transactionHash: '0x02',
        confirmations: 2,
      } as TransactionReceipt,
    },
  ],
};
