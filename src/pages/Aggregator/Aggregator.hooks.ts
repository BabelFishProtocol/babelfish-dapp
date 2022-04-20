import { useEffect, useState } from 'react';
import { UseFormResetField, UseFormSetValue } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ChainEnum, ChainType } from '../../config/chains';
import { TokenTypeBase } from '../../config/tokens';
import {
  flowStateSelector,
  poolSelector,
} from '../../store/aggregator/aggregator.selectors';
import { aggregatorActions } from '../../store/aggregator/aggregator.slice';
import {
  chainIdSelector,
  providerSelector,
} from '../../store/app/app.selectors';
import { switchConnectedChain } from '../../utils/helpers';
import { AggregatorInputs, AggregatorFormValues } from './Aggregator.fields';

export const useAggregatorDropdowns = (
  startingChain: ChainEnum | '',
  destinationChain: ChainEnum | '',
  resetField: UseFormResetField<AggregatorFormValues>,
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
  const flowState = useSelector(flowStateSelector);
  const pool = useSelector(poolSelector);

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
  }, [flowState, startingChain, destinationChain, resetField, pool]);

  return {
    startingChainOptions,
    startingTokenOptions,
    destinationChainOptions,
    destinationTokenOptions,
  };
};

export const useConnectedChain = (
  startingChain: ChainEnum | '',
  destinationChain: ChainEnum | '',
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
  const dispatch = useDispatch();
  const connectedChain = useSelector(chainIdSelector);
  const pool = useSelector(poolSelector);
  const provider = useSelector(providerSelector);

  const showDestinationTokenDropdown = startingChain === pool.masterChain.id;
  const wrongChainConnectedError = startingChain !== connectedChain;

  useEffect(() => {
    if (startingChain && wrongChainConnectedError && provider) {
      switchConnectedChain(provider, startingChain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startingChain]);

  useEffect(() => {
    if (connectedChain && wrongChainConnectedError && setValue) {
      if (destinationChain === connectedChain) {
        dispatch(aggregatorActions.toggleFlowState());
      } else if (
        pool.masterChain.id === startingChain &&
        connectedChain !== pool.masterChain.id
      ) {
        setValue(AggregatorInputs.DestinationChain, connectedChain);
        dispatch(aggregatorActions.toggleFlowState());
      } else if (
        pool.baseChains.find((baseChain) => baseChain.id === connectedChain)
      ) {
        setValue(AggregatorInputs.StartingChain, connectedChain);
      } else {
        // set wrongChainConnectedError so user can see it
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedChain, dispatch, setValue, pool]);

  // TODO: add walletConnection guard to Aggregator
  return {
    wrongChainConnectedError,
    hideDestinationTokenDropdown: !showDestinationTokenDropdown,
  };
};
