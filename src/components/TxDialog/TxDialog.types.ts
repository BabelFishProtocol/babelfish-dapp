import { ContractReceipt, ContractTransaction } from 'ethers';
import { FiniteStates } from '../../utils/types';
import { AppDialogProps } from '../AppDialog/AppDialog.types';

export type SubmitDialogTxData = {
  status: FiniteStates;
  tx: ContractTransaction | undefined;
  txReceipt: ContractReceipt | undefined;
};

export type SubmitStatusDialogProps = Pick<AppDialogProps, 'onClose'> &
  SubmitDialogTxData & {
    operationName: string;
    successCallback?: () => void;
  };

export type TxErrorDialogProps = Pick<
  SubmitStatusDialogProps,
  'onClose' | 'operationName'
> &
  Pick<AppDialogProps, 'isOpenDialog'>;

export type TxSuccessDialogProps = Pick<
  SubmitStatusDialogProps,
  'onClose' | 'operationName' | 'txReceipt' | 'successCallback'
> &
  Pick<AppDialogProps, 'isOpenDialog'>;

export type TxPendingDialogProps = Pick<
  SubmitStatusDialogProps,
  'onClose' | 'operationName' | 'tx'
> &
  Pick<AppDialogProps, 'isOpenDialog'>;
