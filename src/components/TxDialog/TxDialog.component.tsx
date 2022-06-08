import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';

import { Button } from '../Button/Button.component';
import { PrettyTx } from '../PrettyTx/PrettyTx.component';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { MintingInfo } from '../MintingInfo/MintingInfo.component';
import { MintingProcessInfo } from '../MintingInfo/MintingInfo.types';

import errorIcon from '../../assets/icons/error.svg';
import loadingIcon from '../../assets/icons/loading.svg';
import successIcon from '../../assets/icons/success-green.svg';

import {
  CallStepperProps,
  TxErrorDialogProps,
  TxPendingDialogProps,
  TxSuccessDialogProps,
  SubmitStepsDialogProps,
} from './TxDialog.types';
import { StepData } from '../../store/types';

export const TxErrorDialog = ({
  onClose,
  stepper,
  isOpenDialog,
  operationName = '',
}: TxErrorDialogProps) => (
  <AppDialog
    isOpenDialog={isOpenDialog}
    icon={errorIcon}
    title={`${operationName} Error`}
    titleSx={{ color: 'error.main' }}
    description={`We encountered an error in the ${operationName} process. Please try again`}
    onClose={onClose}
    topContent={stepper}
  >
    <Button sx={{ minWidth: 125 }} variant="outlined" onClick={onClose}>
      OK
    </Button>
  </AppDialog>
);

export const TxSuccessDialog = ({
  stepper,
  txReceipt,
  onClose,
  summary,
  isOpenDialog,
  operationName,
  successCallback,
}: TxSuccessDialogProps) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    if (successCallback) {
      successCallback();
    }
  };

  /** Can be removed once all forms are refactored */
  const txReceiptData: MintingProcessInfo[] = txReceipt
    ? [
        {
          label: 'Gas used',
          value: txReceipt.cumulativeGasUsed.toString(),
        },
        {
          label: 'Transaction Hash',
          value: <PrettyTx value={txReceipt.transactionHash} variant="body1" />,
          isProminent: true,
        },
      ]
    : [];

  return (
    <AppDialog
      isOpenDialog={isOpenDialog}
      icon={successIcon}
      title={`${operationName} Complete`}
      titleSx={{
        color: 'success.main',
      }}
      onClose={handleClose}
      topContent={stepper}
    >
      <Box sx={{ mt: 3 }}>
        <MintingInfo data={summary ?? txReceiptData} />
      </Box>
      <Button sx={{ mt: 6, minWidth: 125 }} onClick={handleClose}>
        OK
      </Button>
    </AppDialog>
  );
};

export const TxPendingDialog = ({
  tx,
  stepper,
  operationName,
  isOpenDialog,
}: TxPendingDialogProps) => {
  const txData: MintingProcessInfo[] = tx
    ? [
        { label: 'Gas Limit', value: tx.gasLimit.toString() },
        {
          label: 'Gas Price',
          value: tx?.gasPrice ? tx.gasPrice.toString() : '',
        },
        {
          label: 'Transaction Hash',
          value: <PrettyTx value={tx.hash} variant="body1" />,
          isProminent: true,
        },
      ]
    : [];

  return (
    <AppDialog
      isOpenDialog={isOpenDialog}
      icon={loadingIcon}
      iconSx={{
        width: 80,
        height: 80,
        img: {
          maxHeight: '100%',
          maxWidth: '100%',
        },
      }}
      title={`${operationName} In Progress`}
      titleSx={{
        color: 'primary.main',
      }}
      topContent={stepper}
      description={`${operationName} can take a couple minutes, please make sure to approve the transaction in your wallet when prompted, and wait for it to be complete`}
    >
      <MintingInfo data={txData} />
    </AppDialog>
  );
};

const finishStep: StepData<'finish'> = {
  name: 'finish',
  label: 'finish',
};

const CallStepper = <Operations extends string>({
  steps,
  status,
  currentStep,
}: CallStepperProps<Operations>) => {
  type AllSteps = Operations | 'finish';

  const currentOperation: AllSteps =
    status === 'success' ? 'finish' : currentStep.name;

  const availableSteps: Array<StepData<AllSteps>> = [...steps, finishStep];
  const currentIndex = availableSteps.findIndex(
    (step) => step.name === currentOperation
  );

  return (
    <Stepper activeStep={currentIndex} sx={{ width: '100%', mb: 3 }}>
      {availableSteps.map((step, index) => {
        const isCompleted =
          index < currentIndex ||
          (currentIndex === index && index === availableSteps.length - 1);

        return (
          <Step key={index} completed={isCompleted}>
            <StepLabel error={index === currentIndex && !!currentStep.error}>
              {step.name}
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export const SubmitStepsDialog = <Operations extends string>({
  steps,
  status,
  onClose,
  summary,
  successCallback,
  currentStep = steps[0],
}: SubmitStepsDialogProps<Operations>) => {
  const stepper = useMemo(
    () => (
      <CallStepper steps={steps} status={status} currentStep={currentStep} />
    ),
    [currentStep, status, steps]
  );

  if (status === 'failure') {
    return (
      <TxErrorDialog
        stepper={stepper}
        onClose={onClose}
        operationName={currentStep.label}
        isOpenDialog={status === 'failure'}
      />
    );
  }

  if (status === 'success') {
    return (
      <TxSuccessDialog
        stepper={stepper}
        txReceipt={currentStep.txReceipt}
        operationName={currentStep.label}
        isOpenDialog={status === 'success'}
        onClose={onClose}
        successCallback={successCallback}
        summary={summary}
      />
    );
  }

  return (
    <TxPendingDialog
      tx={currentStep.tx}
      stepper={stepper}
      onClose={onClose}
      operationName={currentStep.label}
      isOpenDialog={status === 'loading'}
    />
  );
};
