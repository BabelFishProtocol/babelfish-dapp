import { useEffect, useState } from 'react';
import { UseFormResetField, UseFormSetValue } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChainEnum,
  ChainType,
  SUPPORTED_CHAINS,
  SUPPORTED_CHAINS_RSK,
} from '../../config/chains';
import { poolHasChain } from '../../config/pools';
import { TokenEnum, TokenTypeBase } from '../../config/tokens';
import { poolSelector } from '../../store/aggregator/aggregator.selectors';
import { aggregatorActions } from '../../store/aggregator/aggregator.slice';
import {
  accountSelector,
  chainIdSelector,
  providerSelector,
} from '../../store/app/app.selectors';
import { switchConnectedChain } from '../../utils/switchConnectedChain';
import { AggregatorInputs, AggregatorFormValues } from './Aggregator.fields';

const isRSK = (chain: ChainEnum | '') =>
  !!chain && SUPPORTED_CHAINS_RSK.includes(chain);
const isNotRSK = (chain: ChainEnum | '') =>
  !!chain && !SUPPORTED_CHAINS_RSK.includes(chain);

export const useAggregatorDropdowns = (
  startingChain: ChainEnum | '',
  destinationChain: ChainEnum | '',
  startingToken: TokenEnum | '',
  destinationToken: TokenEnum | '',
  resetField: UseFormResetField<AggregatorFormValues>,
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
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
    setStartingChainOptions(pool.baseChains);
    setDestinationChainOptions(pool.baseChains);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool]);

  useEffect(() => {
    resetField(AggregatorInputs.StartingToken);
    const bassetTokens =
      pool.baseChains.find((item) => item.id === startingChain)?.bassets ?? [];

    if (isRSK(startingChain)) {
      // Enable all chain options when RSK
      setStartingTokenOptions([pool.masset, ...bassetTokens]);

      if (isRSK(destinationChain)) {
        // Enable all chain options when RSK <-> RSK
        setDestinationTokenOptions([pool.masset, ...bassetTokens]);
      } else if (isNotRSK(destinationChain)) {
        // Force XUSD for RSK when RSK <-> NOT RSK
        setStartingTokenOptions([pool.masset]);
      }
    } else if (startingChain) {
      // Enable basset tokens when selected NOT RSK
      setStartingTokenOptions(bassetTokens);

      if (isRSK(destinationChain)) {
        // Force XUSD for RSK when NOT RSK <-> RSK
        setDestinationTokenOptions([pool.masset]);
      } else if (startingChain && destinationChain) {
        // Reset destination chain when NOT RSK <-> NOT RSK
        setValue(AggregatorInputs.DestinationChain, '');
      }
    } else {
      setStartingTokenOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startingChain, pool.baseChains, pool.masset, resetField, setValue]);

  useEffect(() => {
    resetField(AggregatorInputs.DestinationToken);
    const bassetTokens =
      pool.baseChains.find((item) => item.id === destinationChain)?.bassets ??
      [];

    if (isRSK(destinationChain)) {
      // Enable all chain options when RSK
      setDestinationTokenOptions([pool.masset, ...bassetTokens]);

      if (isRSK(startingChain)) {
        // Enable all chain options when RSK <-> RSK
        setStartingTokenOptions([pool.masset, ...bassetTokens]);
      } else if (isNotRSK(startingChain)) {
        // Force XUSD for RSK when NOT RSK <-> RSK
        setDestinationTokenOptions([pool.masset]);
      }
    } else if (destinationChain) {
      // Enable basset tokens when selected NOT RSK
      setDestinationTokenOptions(bassetTokens);

      if (isRSK(startingChain)) {
        // Force XUSD for RSK when RSK <-> NOT RSK
        setStartingTokenOptions([pool.masset]);
      } else if (startingChain && destinationChain) {
        // Reset starting chain when NOT RSK <-> NOT RSK
        setValue(AggregatorInputs.StartingChain, '');
      }
    } else {
      setDestinationTokenOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationChain, pool.baseChains, pool.masset, setValue, resetField]);

  useEffect(() => {
    if (startingToken === destinationToken) {
      resetField(AggregatorInputs.DestinationToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startingToken, resetField]);

  useEffect(() => {
    if (startingToken === destinationToken) {
      resetField(AggregatorInputs.StartingToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationToken, resetField]);

  const toggleFlow = () => {
    const tempChain = startingChain;
    const tempToken = startingToken;

    setValue(AggregatorInputs.StartingChain, destinationChain);
    setValue(AggregatorInputs.StartingToken, destinationToken);
    setValue(AggregatorInputs.DestinationChain, tempChain);
    setValue(AggregatorInputs.DestinationToken, tempToken);
  };

  return {
    startingChainOptions,
    startingTokenOptions,
    destinationChainOptions,
    destinationTokenOptions,
    toggleFlow,
  };
};

export const useConnectedChain = (
  startingChain: ChainEnum | '',
  resetField: UseFormResetField<AggregatorFormValues>,
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
  const dispatch = useDispatch();
  const connectedChain = useSelector(chainIdSelector);
  const pool = useSelector(poolSelector);
  const provider = useSelector(providerSelector);

  const wrongChainConnectedError = startingChain !== connectedChain;

  useEffect(() => {
    if (
      startingChain &&
      connectedChain &&
      SUPPORTED_CHAINS.includes(connectedChain) &&
      wrongChainConnectedError
    ) {
      resetField(AggregatorInputs.StartingChain);
      resetField(AggregatorInputs.StartingToken);
      switchConnectedChain(startingChain, provider);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, startingChain, connectedChain]);

  useEffect(() => {
    if (
      connectedChain &&
      wrongChainConnectedError &&
      SUPPORTED_CHAINS.includes(connectedChain)
    ) {
      if (!poolHasChain({ pool, chain: connectedChain })) {
        resetField(AggregatorInputs.StartingChain);
        resetField(AggregatorInputs.StartingToken);
        resetField(AggregatorInputs.DestinationChain);
        resetField(AggregatorInputs.DestinationToken);

        dispatch(aggregatorActions.togglePool());
      }
      setValue(AggregatorInputs.StartingChain, connectedChain);
    } else if (connectedChain && !SUPPORTED_CHAINS.includes(connectedChain)) {
      resetField(AggregatorInputs.StartingChain);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedChain, dispatch, setValue]);

  return { wrongChainConnectedError };
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
