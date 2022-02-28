import Box from '@mui/material/Box';

import { Button } from '../Button/Button.component';
import { PrettyTx } from '../PrettyTx/PrettyTx.component';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { MintingInfo } from '../MintingInfo/MintingInfo.component';
import { MintingProcessInfo } from '../MintingInfo/MintingInfo.types';

import errorIcon from '../../assets/icons/error.svg';
import loadingIcon from '../../assets/icons/loading.svg';
import successIcon from '../../assets/icons/success.svg';

import {
  SubmitStatusDialogProps,
  TxErrorDialogProps,
  TxPendingDialogProps,
  TxSuccessDialogProps,
} from './TxDialog.types';

export const TxErrorDialog = ({
  isOpenDialog,
  onClose,
  operationName,
}: TxErrorDialogProps) => (
  <AppDialog
    isOpenDialog={isOpenDialog}
    icon={errorIcon}
    title="Minting Error"
    description={`We encountered an error in the ${operationName} process. Please try again`}
    onClose={onClose}
  >
    <Button variant="outlined" onClick={onClose}>
      Try Again
    </Button>
  </AppDialog>
);

export const TxSuccessDialog = ({
  txReceipt,
  onClose,
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
  const txReceiptData: MintingProcessInfo[] = txReceipt
    ? [
        {
          label: 'Gas used',
          value: txReceipt.cumulativeGasUsed.toString(),
        },
        {
          label: 'Transaction Hash',
          value: <PrettyTx value={txReceipt.transactionHash} variant="body1" />,
          isProminant: true,
        },
      ]
    : [];

  return (
    <AppDialog
      isOpenDialog={isOpenDialog}
      icon={successIcon}
      title={`${operationName} Complete`}
      onClose={handleClose}
    >
      <Box sx={{ mt: 3 }}>
        <MintingInfo data={txReceiptData} />
      </Box>
      <Button sx={{ mt: 6 }} onClick={handleClose}>
        OK
      </Button>
    </AppDialog>
  );
};

export const TxPendingDialog = ({
  isOpenDialog,
  operationName,
  tx,
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
          isProminant: true,
        },
      ]
    : [];

  return (
    <AppDialog
      isOpenDialog={isOpenDialog}
      icon={loadingIcon}
      title={`${operationName} In Progress`}
      description={`${operationName} can take a couple minutes, please make sure to approve the transaction in your wallet when prompted, and wait for it to be complete`}
    >
      <MintingInfo data={txData} />
    </AppDialog>
  );
};

export const SubmitStatusDialog = ({
  tx,
  status,
  txReceipt,
  ...dialogProps
}: SubmitStatusDialogProps) => {
  if (status === 'failure') {
    return (
      <TxErrorDialog isOpenDialog={status === 'failure'} {...dialogProps} />
    );
  }

  if (status === 'success') {
    return (
      <TxSuccessDialog
        txReceipt={txReceipt}
        isOpenDialog={status === 'success'}
        {...dialogProps}
      />
    );
  }

  return (
    <TxPendingDialog
      tx={tx}
      isOpenDialog={status === 'loading'}
      {...dialogProps}
    />
  );
};
