import { ContractReceipt, ContractTransaction } from 'ethers';
import { StepData } from '../../store/types';
import { FiniteStates } from '../../utils/types';
import { AppDialogProps } from '../AppDialog/AppDialog.types';
import { MintingProcessInfo } from '../MintingInfo/MintingInfo.types';

export type CallStepperProps<Operations extends string> = {
  status: FiniteStates;
  steps: StepData<Operations>[];
  currentStep: StepData<Operations>;
};

export type SubmitStepsDialogProps<Operations extends string> = Pick<
  AppDialogProps,
  'onClose'
> & {
  status: FiniteStates;
  successCallback?: () => void;
  steps: StepData<Operations>[];
  currentStep?: StepData<Operations>;
  summary?: MintingProcessInfo[];
};

export type SubmitDialogTxData = {
  status: FiniteStates;
  tx?: ContractTransaction;
  txReceipt?: ContractReceipt;
  summary?: MintingProcessInfo[];
};

export type SubmitStatusDialogProps = Pick<AppDialogProps, 'onClose'> &
  SubmitDialogTxData & {
    operationName?: string;
    successCallback?: () => void;
  };

type Stepper = {
  stepper?: React.ReactNode;
};

export type TxErrorDialogProps = Stepper &
  Pick<SubmitStatusDialogProps, 'onClose' | 'operationName'> &
  Pick<AppDialogProps, 'isOpenDialog'>;

export type TxSuccessDialogProps = Stepper &
  Pick<
    SubmitStatusDialogProps,
    'onClose' | 'operationName' | 'txReceipt' | 'successCallback'
  > &
  Pick<AppDialogProps, 'isOpenDialog'> & {
    summary?: MintingProcessInfo[];
  };

export type TxPendingDialogProps = Stepper &
  Pick<SubmitStatusDialogProps, 'onClose' | 'operationName' | 'tx'> &
  Pick<AppDialogProps, 'isOpenDialog'>;
