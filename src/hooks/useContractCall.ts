import { useState } from 'react';
import { ContractReceipt, ContractTransaction } from 'ethers';

import { FiniteStates } from '../utils/types';

type BaseContractCall = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
) => Promise<ContractTransaction | undefined>;

export const useContractCall = <SubmitFn extends BaseContractCall>(
  submitFunction: SubmitFn
) => {
  const [status, setStatus] = useState<FiniteStates>('idle');
  const [tx, setTx] = useState<ContractTransaction>();
  const [txReceipt, setTxReceipt] = useState<ContractReceipt>();

  const onClose = () => {
    setStatus('idle');
    setTx(undefined);
    setTxReceipt(undefined);
  };

  const handleSubmit = async (...args: Parameters<SubmitFn>) => {
    setStatus('loading');
    try {
      const txData = await submitFunction(...args);
      setTx(txData);

      const receipt = await txData?.wait();
      setTxReceipt(receipt);
      setStatus('success');
    } catch (e) {
      setStatus('failure');
    }
  };

  return {
    tx,
    status,
    txReceipt,
    handleSubmit,
    onClose,
  };
};
