import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { UseFormResetField, UseFormSetValue } from 'react-hook-form';
import { ChainEnum, ChainType } from '../../config/chains';
import { mainnetPool } from '../../config/pools';
import { TokenEnum, TokenTypeBase } from '../../config/tokens';
import { AgregatorInputs } from './Agregator.fields';
import {
  AgregatorComponentProps,
  AgregatorFormValues,
} from './Agregator.types';

export const useAgregatorDropdowns = (
  startingChain: ChainEnum | '',
  destinationChain: ChainEnum | '',
  resetField: UseFormResetField<AgregatorFormValues>,
  setValue: UseFormSetValue<AgregatorFormValues>
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
    resetField(AgregatorInputs.StartingToken);
    if (!startingChain) {
      setStartingTokenOptions([]);
      setDestinationChainOptions([]);
    } else if (startingChain === mainnetPool.masterChain.id) {
      if (destinationChain === mainnetPool.masterChain.id) {
        resetField(AgregatorInputs.DestinationChain);
      }
      setStartingTokenOptions([mainnetPool.masset]);
      setValue(AgregatorInputs.StartingToken, mainnetPool.masset.id);
      setDestinationChainOptions(mainnetPool.baseChains);
    } else {
      setStartingTokenOptions(
        mainnetPool.baseChains.find((item) => item.id === startingChain)
          ?.bassets ?? []
      );
      setDestinationChainOptions([mainnetPool.masterChain]);
      setValue(AgregatorInputs.DestinationChain, mainnetPool.masterChain.id);
    }
  }, [startingChain, destinationChain, resetField, setValue]);

  useEffect(() => {
    resetField(AgregatorInputs.DestinationToken);
    if (!destinationChain) {
      setDestinationTokenOptions([]);
    } else if (destinationChain === mainnetPool.masterChain.id) {
      setDestinationTokenOptions([mainnetPool.masset]);
      setValue(AgregatorInputs.DestinationToken, mainnetPool.masset.id);
    } else {
      setDestinationTokenOptions(
        mainnetPool.baseChains.find((item) => item.id === destinationChain)
          ?.bassets ?? []
      );
    }
  }, [destinationChain, resetField, setValue]);

  const changeDirection = () => {
    setValue(AgregatorInputs.StartingChain, destinationChain);
    setValue(AgregatorInputs.DestinationChain, startingChain);
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
  getTokenAvaliableBalance: AgregatorComponentProps['getTokenAvaliableBalance'],
  resetField: UseFormResetField<AgregatorFormValues>
) => {
  const [availableBalance, setAvailableBalance] = useState<BigNumber>();

  useEffect(() => {
    if (token) {
      setAvailableBalance(getTokenAvaliableBalance(token));
    } else {
      resetField(AgregatorInputs.SendAmount);
      setAvailableBalance(undefined);
    }
  }, [token, getTokenAvaliableBalance, resetField]);

  return { availableBalance };
};
