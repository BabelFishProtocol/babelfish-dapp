import { useEffect, useMemo, useState } from 'react';
import { UseFormResetField, UseFormSetValue } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChainEnum,
  ChainType,
  isNotRSK,
  isRSK,
  SUPPORTED_CHAINS,
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
import { FocusActiveFieldParameters } from './Aggregator.types';
import {
  focusCurrentFieldIfEmpty,
  removeFocusFromCurrentField,
} from './Aggregator.utils';

export const useAggregatorDropdowns = (
  startingChain: ChainEnum | '',
  destinationChain: ChainEnum | '',
  startingToken: TokenEnum | '',
  destinationToken: TokenEnum | '',
  resetField: UseFormResetField<AggregatorFormValues>,
  setValue: UseFormSetValue<AggregatorFormValues>
) => {
  const pool = useSelector(poolSelector);
  const provider = useSelector(providerSelector);
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
  }, [pool.baseChains]);

  const startingChainBassetTokens = useMemo(
    () =>
      pool.baseChains.find((item) => item.id === startingChain)?.bassets ?? [],
    [pool.baseChains, startingChain]
  );

  const destinationChainBassetTokens = useMemo(
    () =>
      pool.baseChains.find((item) => item.id === destinationChain)?.bassets ??
      [],
    [destinationChain, pool.baseChains]
  );

  useEffect(() => {
    resetField(AggregatorInputs.StartingToken);

    if (isRSK(startingChain)) {
      // Enable all chain options when RSK
      setStartingTokenOptions([pool.masset, ...startingChainBassetTokens]);

      if (isRSK(destinationChain)) {
        // Enable all chain options when RSK -> RSK
        setDestinationTokenOptions([
          pool.masset,
          ...destinationChainBassetTokens,
        ]);
        return;
      }

      if (isNotRSK(destinationChain)) {
        // Force XUSD for RSK when RSK -> NOT RSK
        setStartingTokenOptions([pool.masset]);
        return;
      }
    }

    if (isNotRSK(startingChain)) {
      // Enable basset tokens when selected NOT RSK
      setStartingTokenOptions(startingChainBassetTokens);

      if (isRSK(destinationChain)) {
        // Force XUSD for RSK when NOT RSK -> RSK
        setDestinationTokenOptions([pool.masset]);
        return;
      }

      if (startingChain && destinationChain) {
        // Reset destination chain when NOT RSK -> NOT RSK
        setValue(AggregatorInputs.DestinationChain, '');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    startingChain,
    pool.baseChains,
    pool.masset,
    resetField,
    setValue,
    destinationChainBassetTokens,
  ]);

  useEffect(() => {
    resetField(AggregatorInputs.DestinationToken);

    if (isRSK(destinationChain)) {
      // Enable all chain options when RSK
      setDestinationTokenOptions([
        pool.masset,
        ...destinationChainBassetTokens,
      ]);

      if (isRSK(startingChain)) {
        // Enable all chain options when RSK -> RSK
        setStartingTokenOptions([pool.masset, ...startingChainBassetTokens]);
        return;
      }

      if (isNotRSK(startingChain)) {
        // Force XUSD for RSK when NOT RSK -> RSK
        setDestinationTokenOptions([pool.masset]);
        return;
      }
    }

    if (isNotRSK(destinationChain)) {
      // Enable basset tokens when selected NOT RSK
      setDestinationTokenOptions(destinationChainBassetTokens);

      if (isRSK(startingChain)) {
        // Force XUSD for RSK when RSK -> NOT RSK
        setStartingTokenOptions([pool.masset]);
        return;
      }

      if (startingChain && destinationChain) {
        // Reset starting chain when NOT RSK -> NOT RSK
        setValue(AggregatorInputs.StartingChain, '');
        return;
      }
    }

    setDestinationTokenOptions([]);
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
  }, [
    destinationToken,
    resetField,
    destinationChainBassetTokens,
    startingChainBassetTokens,
  ]);

  useEffect(() => {
    if (isRSK(startingChain) && isRSK(destinationChain) && startingToken) {
      if (startingToken !== TokenEnum.XUSD) {
        setDestinationTokenOptions([pool.masset]);
      } else {
        setDestinationTokenOptions([
          pool.masset,
          ...destinationChainBassetTokens,
        ]);
      }
    }
  }, [
    destinationChainBassetTokens,
    destinationChain,
    pool.masset,
    startingChain,
    startingToken,
  ]);

  const toggleFlow = async () => {

    const _startingChain = startingChain;
    const _startingToken = startingToken;
    const _destinationChain = destinationChain;
    const _destinationToken = destinationToken;

    // if (destinationChain && destinationChain !== startingChain) {
    //   await switchConnectedChain(_destinationChain as ChainEnum, provider);
    // }

    setValue(AggregatorInputs.DestinationChain, _startingChain);
    setValue(AggregatorInputs.StartingChain, _destinationChain);
    setValue(AggregatorInputs.DestinationToken, _startingToken);
    setValue(AggregatorInputs.StartingToken, _destinationToken);

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

  const isConnectedChainSupported =
    connectedChain && SUPPORTED_CHAINS.includes(connectedChain);
  const wrongChainConnectedError = startingChain !== connectedChain;

  useEffect(() => {
    if (
      startingChain &&
      isConnectedChainSupported &&
      wrongChainConnectedError
    ) {
      switchConnectedChain(startingChain, provider);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startingChain]);

  useEffect(() => {
    if (isConnectedChainSupported && wrongChainConnectedError) {
      if (!poolHasChain({ pool, chain: connectedChain })) {
        // toggle between testnet/mainnet
        resetField(AggregatorInputs.DestinationChain);
        dispatch(aggregatorActions.togglePool());
      }

      setValue(AggregatorInputs.StartingChain, connectedChain);
      return;
    }

    if (connectedChain && !SUPPORTED_CHAINS.includes(connectedChain)) {
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

export const useFocusActiveFields = (
  parameters: FocusActiveFieldParameters[]
) => {
  useEffect(() => {
    focusCurrentFieldIfEmpty(parameters[0]);
  }, [parameters]);

  useEffect(() => {
    removeFocusFromCurrentField(parameters[0]);
  }, [parameters]);

  useEffect(() => {
    focusCurrentFieldIfEmpty(parameters[1]);
  }, [parameters]);

  useEffect(() => {
    removeFocusFromCurrentField(parameters[1]);
  }, [parameters]);
};
