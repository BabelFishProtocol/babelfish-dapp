import { BigNumber } from 'ethers';
import { MintingProcessInfo } from '../../components/MintingInfo/MintingInfo.types';
import { formatWeiAmount } from '../../utils/helpers';
import { CallState } from '../types';

const prepareSummary = <Operations extends string>(
  state: CallState<Operations>
): MintingProcessInfo[] => {
  const txHashesInfo: MintingProcessInfo[] = state.steps.map((step) => ({
    formatTx: true,
    value: step?.tx?.hash || '',
    label: `${step.name} tx hash`,
  }));

  const totalGasUsed = state.steps.reduce((prev, curr) => {
    if (!curr.txReceipt || !curr.tx || !curr.tx.gasPrice) {
      return prev;
    }

    return prev.add(curr.txReceipt.gasUsed.mul(curr.tx.gasPrice));
  }, BigNumber.from(0));

  const combinedDetails: MintingProcessInfo[] = [
    ...txHashesInfo,
    {
      label: 'Total Gas Used',
      value: `${formatWeiAmount(totalGasUsed, 7)} RBTC`,
    },
  ];

  return combinedDetails;
};

export const selectCurrentCallStepData = <Operations extends string>(
  state: CallState<Operations>
) => {
  const currentStep = state.steps.find(
    (step) => step.name === state.currentOperation
  );

  const summary = prepareSummary(state);

  return {
    summary,
    currentStep,
    steps: state.steps,
    status: state.status,
  };
};
