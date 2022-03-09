import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { UseFormResetField, UseFormSetValue } from 'react-hook-form';
import { ChainEnum, ChainType } from '../../config/chains';
import { mainnetPool } from '../../config/pools';
import { TokenEnum, TokenTypeBase } from '../../config/tokens';
import { AggregatorInputs, AggregatorFormValues } from './Aggregator.fields';
import { AggregatorComponentProps } from './Aggregator.types';

export const useAggregatorDropdowns = (
  startingChain: ChainEnum | '',
  destinationChain: ChainEnum | '',
  resetField: UseFormResetField<AggregatorFormValues>,
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
  const [startingTokenOptions, setStartingTokenOptions] = useState<
    TokenTypeBase[]
  >([]);
  const [destinationChainOptions, setDestinationChainOptions] = useState<
    ChainType[]
  >([]);
  const [destinationTokenOptions, setDestinationTokenOptions] = useState<
    TokenTypeBase[]
  >([]);

  const startingChainOptions = [
    ...mainnetPool.baseChains,
    mainnetPool.masterChain,
  ];

  useEffect(() => {
    resetField(AggregatorInputs.StartingToken);
    if (!startingChain) {
      setStartingTokenOptions([]);
      setDestinationChainOptions([]);
    } else if (startingChain === mainnetPool.masterChain.id) {
      if (destinationChain === mainnetPool.masterChain.id) {
        resetField(AggregatorInputs.DestinationChain);
      }
      setStartingTokenOptions([mainnetPool.masset]);
      setValue(AggregatorInputs.StartingToken, mainnetPool.masset.id);
      setDestinationChainOptions(mainnetPool.baseChains);
    } else {
      setStartingTokenOptions(
        mainnetPool.baseChains.find((item) => item.id === startingChain)
          ?.bassets ?? []
      );
      setDestinationChainOptions([mainnetPool.masterChain]);
      setValue(AggregatorInputs.DestinationChain, mainnetPool.masterChain.id);
    }
  }, [startingChain, destinationChain, resetField, setValue]);

  useEffect(() => {
    resetField(AggregatorInputs.DestinationToken);
    if (!destinationChain) {
      setDestinationTokenOptions([]);
    } else if (destinationChain === mainnetPool.masterChain.id) {
      setDestinationTokenOptions([mainnetPool.masset]);
      setValue(AggregatorInputs.DestinationToken, mainnetPool.masset.id);
    } else {
      setDestinationTokenOptions(
        mainnetPool.baseChains.find((item) => item.id === destinationChain)
          ?.bassets ?? []
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
