import { BigNumber, ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { ChainEnum, isRSK } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import {
  startingTokenBalanceSelector,
  destinationTokenAggregatorBalanceSelector,
  startingTokenDecimalsSelector,
  incentivesStateSelector,
  feesAndLimitsStateSelector,
  receiveAmountSelector,
} from '../../store/aggregator/aggregator.selectors';
import { isRskAddress } from '../../utils/helpers';
import { FocusActiveFieldParameters } from './Aggregator.types';

export const focusCurrentFieldIfEmpty = ({
  isPreviousFieldEmpty,
  isCurrentFieldEmpty,
  currentFieldRef,
}: FocusActiveFieldParameters) => {
  if (
    !isPreviousFieldEmpty &&
    currentFieldRef?.current &&
    isCurrentFieldEmpty
  ) {
    const node = currentFieldRef.current;
    node.style.borderWidth = '1px';
    node.style.borderStyle = 'solid';
    node.style.borderColor = '#ffbf42';
    node.style.color = '#ffbf42';
  }
};

export const removeFocusFromCurrentField = ({
  isPreviousFieldEmpty,
  isCurrentFieldEmpty,
  currentFieldRef,
}: FocusActiveFieldParameters) => {
  if (
    !isPreviousFieldEmpty &&
    currentFieldRef.current &&
    !isCurrentFieldEmpty
  ) {
    const node = currentFieldRef.current;
    node.style.borderColor = 'transparent';
    node.style.color = '#fff';
  }
};

export function useIsFormValid(state: {
  startingToken: string;
  destinationToken: string;
  startingChain: ChainEnum;
  destinationChain: ChainEnum;
  amount: string;
  receivingAddress: string;
  isAddressDisclaimerChecked: boolean;
  isStartingTokenPaused: boolean;
}): boolean {
  const startingTokenBalance = useSelector(startingTokenBalanceSelector) ?? 0;
  const destinationTokenAggregatorBalance = useSelector(
    destinationTokenAggregatorBalanceSelector
  ) ?? 0;
  const startingTokenDecimals = useSelector(startingTokenDecimalsSelector);

  const incentivesState = useSelector(incentivesStateSelector);
  const feesState = useSelector(feesAndLimitsStateSelector);
  const isCrossChain = state.startingChain !== state.destinationChain;
  if(incentivesState !== 'success' || (isCrossChain && feesState !== 'success')) {
    return false;
  }

  // validate the tokens
  if (
    !(isRSK(state.startingChain) || isRSK(state.destinationChain)) ||
    !state.startingToken ||
    !state.destinationToken
  ) {
    return false;
  }

  if (state.isStartingTokenPaused) {
    return false;
  }

  // check that amount is defined
  if (!state.amount || Number(state.amount) <= 0) {
    return false;
  }

  // check that user has enough balance
  const userBalance = Number(
    ethers.utils.formatUnits(
      BigNumber.from(startingTokenBalance),
      startingTokenDecimals
    )
  );
  if (userBalance < Number(state.amount)) {
    return false;
  }

  // validate the receiving address
  if (!isRskAddress(state.receivingAddress)) {
    return false;
  }

  if (!state.isAddressDisclaimerChecked) {
    return false;
  }

  if (
    state.startingToken === TokenEnum.XUSD &&
    Number(destinationTokenAggregatorBalance) < Number(state.amount)
  ) {
    return false;
  }

  return true;
}
