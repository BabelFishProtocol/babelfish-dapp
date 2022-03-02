import { useState } from 'react';
import { FieldValues } from 'react-hook-form';
import { ContractReceipt, ContractTransaction } from 'ethers';

import { FiniteStates } from '../utils/types';

export const useContractCall = <Values extends FieldValues>(
  submitFunction: (values: Values) => Promise<ContractTransaction | undefined>
) => {
  const [status, setStatus] = useState<FiniteStates>('idle');
  const [tx, setTx] = useState<ContractTransaction>();
  const [txReceipt, setTxReceipt] = useState<ContractReceipt>();

  const onClose = () => {
    setStatus('idle');
    setTx(undefined);
    setTxReceipt(undefined);
  };

  const handleSubmit = async (formValues: Values) => {
    setStatus('loading');
    try {
      const txData = await submitFunction(formValues);
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
