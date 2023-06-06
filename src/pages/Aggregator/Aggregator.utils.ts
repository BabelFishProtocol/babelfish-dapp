import { BigNumber, ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { ChainEnum, isRSK } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { startingTokenBalanceSelector, destinationTokenAggregatorBalanceSelector, startingTokenDecimalsSelector } from '../../store/aggregator/aggregator.selectors';
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

export function isFormValid(state: { 
  startingToken: string,
  destinationToken: string,
  startingChain: ChainEnum, 
  destinationChain: ChainEnum,
  amount: string,
  receivingAddress: string,
  isAddressDisclaimerChecked: boolean,
  isStartingTokenPaused: boolean
}): boolean {

  const startingTokenBalance = useSelector(startingTokenBalanceSelector);
  const destinationTokenAggregatorBalance = useSelector(destinationTokenAggregatorBalanceSelector);
  const startingTokenDecimals = useSelector(startingTokenDecimalsSelector);

  // validate the tokens
  if (!( isRSK(state.startingChain) || isRSK(state.destinationChain) ) ||
    !state.startingToken ||
    !state.destinationToken){
      console.log(`Invalid starting or destination token selected: ${state.startingToken} -> ${state.destinationToken}`);
      return false;
  }

  if (state.isStartingTokenPaused) {
      console.log(`Starting token is paused`);
      return false;
  }

  // check that amount is defined
  if(!state.amount || Number(state.amount) <= 0){
    console.log(`Invalid amount: ${state.amount}`);
    return false;
  }

  // check that user has enough balance
  const userBalance = Number(
    ethers.utils.formatUnits(BigNumber.from(startingTokenBalance), startingTokenDecimals));
  if(userBalance < Number(state.amount)) {
    console.log(`User balance not sufficient, ${state.amount} > ${userBalance}`);
    return false;
  }

  // validate the receiving address
  if (!isRskAddress(state.receivingAddress)) {
    console.log(`Invalid receiving address: ${state.receivingAddress}`);
    return false;
  }

  if(!state.isAddressDisclaimerChecked) {
    console.log('Disclaimer checkbox not checked');
    return false;
  }

  if(state.startingToken == TokenEnum.XUSD && BigNumber.from(destinationTokenAggregatorBalance).lt(state.amount)) {
    console.log(`Aggregator balance insufficient: ${destinationTokenAggregatorBalance} < ${state.amount}`);
    return false;
  }

  console.log('Form is valid and ready to send');
  return true;
}
