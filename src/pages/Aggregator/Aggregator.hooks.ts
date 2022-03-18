import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { UseFormResetField, UseFormSetValue } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ChainEnum, ChainType } from '../../config/chains';
import { /* mainnetPool, */ testnetPool } from '../../config/pools';
import { TokenEnum, TokenTypeBase } from '../../config/tokens';
import { flowStateSelector } from '../../store/aggregator/aggregator.selectors';
import { aggregatorActions } from '../../store/aggregator/aggregator.slice';
import { AggregatorInputs, AggregatorFormValues } from './Aggregator.fields';
import { AggregatorComponentProps } from './Aggregator.types';

const pool = testnetPool;

export const useAggregatorDropdowns = (
  startingChain: ChainEnum | '',
  destinationChain: ChainEnum | '',
  resetField: UseFormResetField<AggregatorFormValues>,
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
  const flowState = useSelector(flowStateSelector);

  const [startingChainOptions, setStartingChainOptions] = useState<ChainType[]>(
    []
  );

  const [startingTokenOptions, setStartingTokenOptions] = useState<
    TokenTypeBase[]
  >([]);
  const [destinationChainOptions, setDestinationChainOptions] = useState<
    ChainType[]
  >([]);
  const [destinationTokenOptions, setDestinationTokenOptions] = useState<
    TokenTypeBase[]
  >([]);

  useEffect(() => {
    if (flowState === 'deposit') {
      setValue(AggregatorInputs.StartingChain, destinationChain);
      setStartingChainOptions(pool.baseChains);

      resetField(AggregatorInputs.StartingToken);
      setStartingTokenOptions([]);

      resetField(AggregatorInputs.DestinationChain);
      resetField(AggregatorInputs.DestinationToken);

      setDestinationChainOptions([pool.masterChain]);
      setDestinationTokenOptions([pool.masset]);
    } else {
      resetField(AggregatorInputs.DestinationChain);
      setDestinationChainOptions(pool.baseChains);
      setValue(AggregatorInputs.DestinationChain, startingChain);

      resetField(AggregatorInputs.DestinationToken);
      setDestinationTokenOptions([]);

      resetField(AggregatorInputs.StartingChain);
      resetField(AggregatorInputs.StartingToken);

      setStartingChainOptions([pool.masterChain]);
      setStartingTokenOptions([pool.masset]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowState, setValue, resetField]);

  useEffect(() => {
    if (flowState === 'deposit' && startingChain) {
      resetField(AggregatorInputs.StartingToken);
      setStartingTokenOptions(
        pool.baseChains.find((item) => item.id === startingChain)?.bassets ?? []
      );
    }
    if (flowState === 'withdraw' && destinationChain) {
      resetField(AggregatorInputs.DestinationToken);
      setDestinationTokenOptions(
        pool.baseChains.find((item) => item.id === destinationChain)?.bassets ??
          []
      );
    }
  }, [flowState, startingChain, destinationChain, resetField]);

  const dispatch = useDispatch();

  const changeDirection = () => {
    dispatch(aggregatorActions.toggleFlowState());
  };

  return {
    startingChainOptions,
    startingTokenOptions,
    destinationChainOptions,
    destinationTokenOptions,
    changeDirection,
  };
};

export const useAvailableBalance = (
  token: TokenEnum | '',
  getTokenAvailableBalance: AggregatorComponentProps['getTokenAvailableBalance'],
  resetField: UseFormResetField<AggregatorFormValues>
) => {
  const [availableBalance, setAvailableBalance] = useState<BigNumber>();

  useEffect(() => {
    if (token) {
      setAvailableBalance(getTokenAvailableBalance(token));
    } else {
      resetField(AggregatorInputs.SendAmount);
      setAvailableBalance(undefined);
    }
  }, [token, getTokenAvailableBalance, resetField]);

  return { availableBalance };
};
