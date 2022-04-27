import { useEffect, useState } from 'react';
import {
  UseFormReset,
  UseFormResetField,
  UseFormSetValue,
} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ChainEnum, ChainType } from '../../config/chains';
import { poolHasChain } from '../../config/pools';
import { TokenTypeBase } from '../../config/tokens';
import {
  flowStateSelector,
  poolSelector,
} from '../../store/aggregator/aggregator.selectors';
import { aggregatorActions } from '../../store/aggregator/aggregator.slice';
import {
  accountSelector,
  chainIdSelector,
  providerSelector,
} from '../../store/app/app.selectors';
import { switchConnectedChain } from '../../utils/switchConnectedChain';
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
  }, [flowState, setValue, resetField, pool]);

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
  reset: UseFormReset<AggregatorFormValues>,
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
  const dispatch = useDispatch();
  const connectedChain = useSelector(chainIdSelector);
  const pool = useSelector(poolSelector);
  const provider = useSelector(providerSelector);

  const showDestinationTokenDropdown = startingChain === pool.masterChain.id;
  const wrongChainConnectedError = startingChain !== connectedChain;

  useEffect(() => {
    if (startingChain && wrongChainConnectedError) {
      switchConnectedChain(startingChain, provider);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startingChain]);

  useEffect(() => {
    if (connectedChain && wrongChainConnectedError && setValue) {
      if (!poolHasChain({ pool, chain: connectedChain })) {
        reset();
        dispatch(aggregatorActions.setStartingToken(undefined));
        dispatch(aggregatorActions.setDestinationChain(undefined));
        dispatch(aggregatorActions.setDestinationToken(undefined));
        dispatch(aggregatorActions.togglePool());
      } else if (destinationChain === connectedChain) {
        dispatch(aggregatorActions.toggleFlowState());
      } else if (
        pool.masterChain.id === startingChain &&
        connectedChain !== pool.masterChain.id
      ) {
        setValue(AggregatorInputs.DestinationChain, connectedChain);
        dispatch(aggregatorActions.toggleFlowState());
      } else if (pool.masterChain.id !== connectedChain) {
        setValue(AggregatorInputs.StartingChain, connectedChain);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedChain, dispatch, setValue, pool]);

  return {
    wrongChainConnectedError,
    hideDestinationTokenDropdown: !showDestinationTokenDropdown,
  };
};

export const useWalletAddress = (
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
  const walletAddress = useSelector(accountSelector);

  useEffect(() => {
    if (walletAddress) {
      setValue(AggregatorInputs.ReceiveAddress, walletAddress);
    }
  }, [walletAddress, setValue]);
};
