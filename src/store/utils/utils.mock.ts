import { TransactionReceipt } from '@ethersproject/providers';
import { BigNumber, ContractTransaction } from 'ethers';
import { CallState } from '../types';

export const initialCallState: CallState<'step1' | 'step2'> = {
  status: 'idle',
  steps: [
    { name: 'step1', label: 'Step1' },
    { name: 'step2', label: 'Step2' },
  ],
};

export const populatedCallState: CallState<'step1' | 'step2'> = {
  status: 'success',
  currentOperation: 'step1',
  steps: [
    {
      name: 'step1',
      label: 'Step1',
      tx: {
        hash: '0x01',
        gasPrice: BigNumber.from(2000),
      } as ContractTransaction,
      txReceipt: {
        transactionHash: '0x01',
        confirmations: 2,
        gasUsed: BigNumber.from(100000000),
      } as TransactionReceipt,
    },
    {
      name: 'step2',
      label: 'Step2',
      tx: {
        hash: '0x02',
        gasPrice: BigNumber.from(2000),
      } as ContractTransaction,
      txReceipt: {
        transactionHash: '0x02',
        confirmations: 2,
        gasUsed: BigNumber.from(200000000),
      } as TransactionReceipt,
    },
  ],
};
