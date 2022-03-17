import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { UseFormResetField, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { ChainEnum, ChainType } from '../../config/chains';
import { /* mainnetPool, */ testnetPool } from '../../config/pools';
import { TokenEnum, TokenTypeBase } from '../../config/tokens';
import { chainIdSelector } from '../../store/app/app.selectors';
import { AggregatorInputs, AggregatorFormValues } from './Aggregator.fields';
import { AggregatorComponentProps } from './Aggregator.types';

const pool = testnetPool;

export const useAggregatorDropdowns = (
  startingChain: ChainEnum | '',
  destinationChain: ChainEnum | '',
  resetField: UseFormResetField<AggregatorFormValues>,
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
  const connectedChain = useSelector(chainIdSelector);

  const [startingTokenOptions, setStartingTokenOptions] = useState<
    TokenTypeBase[]
  >([]);
  const [destinationChainOptions, setDestinationChainOptions] = useState<
    ChainType[]
  >([]);
  const [destinationTokenOptions, setDestinationTokenOptions] = useState<
    TokenTypeBase[]
  >([]);

  const startingChainOptions = [...pool.baseChains, pool.masterChain];

  useEffect(() => {
    if (connectedChain) {
      console.log('dupa', connectedChain, Object.values(ChainEnum));
      if (Object.values(ChainEnum).includes(connectedChain)) {
        setValue(AggregatorInputs.StartingChain, connectedChain);
      } else {
        throw new Error('Dupa');
      }
    }
  }, [connectedChain, setValue]);

  useEffect(() => {
    resetField(AggregatorInputs.StartingToken);
    if (!startingChain) {
      setStartingTokenOptions([]);
      setDestinationChainOptions([]);
    } else if (startingChain === pool.masterChain.id) {
      if (destinationChain === pool.masterChain.id) {
        resetField(AggregatorInputs.DestinationChain);
      }
      setStartingTokenOptions([pool.masset]);
      setValue(AggregatorInputs.StartingToken, pool.masset.id);
      setDestinationChainOptions(pool.baseChains);
    } else {
      setStartingTokenOptions(
        pool.baseChains.find((item) => item.id === startingChain)?.bassets ?? []
      );
      setDestinationChainOptions([pool.masterChain]);
      setValue(AggregatorInputs.DestinationChain, pool.masterChain.id);
    }
  }, [startingChain, destinationChain, resetField, setValue]);

  useEffect(() => {
    resetField(AggregatorInputs.DestinationToken);
    if (!destinationChain) {
      setDestinationTokenOptions([]);
    } else if (destinationChain === pool.masterChain.id) {
      setDestinationTokenOptions([pool.masset]);
      setValue(AggregatorInputs.DestinationToken, pool.masset.id);
    } else {
      setDestinationTokenOptions(
        pool.baseChains.find((item) => item.id === destinationChain)?.bassets ??
          []
      );
    }
  }, [destinationChain, resetField, setValue]);

  const changeDirection = () => {
    setValue(AggregatorInputs.StartingChain, destinationChain);
    setValue(AggregatorInputs.DestinationChain, startingChain);
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
