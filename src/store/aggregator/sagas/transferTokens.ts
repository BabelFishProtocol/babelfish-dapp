import { utils } from 'ethers';
import { call, put, select } from 'typed-redux-saga';
import { ChainEnum } from '../../../config/chains';
import {
  accountSelector,
  massetContractSelector,
} from '../../app/app.selectors';
import { SagaContactEffect, SagaContractCallStep } from '../../types';
import { contractStepCallsSaga } from '../../utils/utils.sagas';
import {
  bassetAddressSelector,
  bridgeContractSelector,
  flowStateSelector,
  massetAddressSelector,
  startingTokenAddressSelector,
  startingTokenContractSelector,
  startingTokenDecimalsSelector,
} from '../aggregator.selectors';
import { AggregatorActions, aggregatorActions } from '../aggregator.slice';
import { AggregatorCalls } from '../aggregator.state';

export function* depositTokens({ payload }: AggregatorActions['submit']) {
  const bridge = yield* select(bridgeContractSelector);
  const tokenAddress = yield* select(startingTokenAddressSelector);
  const tokenDecimals = yield* select(startingTokenDecimalsSelector);
  const tokenContract = yield* select(startingTokenContractSelector);
  const massetAddress = yield* select(massetAddressSelector);
  const massetContract = yield* select(massetContractSelector);
  const account = yield* select(accountSelector);
  const { StartingChain: startingChain, ReceiveAddress: receiver } = payload;

  if (!massetContract || !tokenContract || !bridge || !startingChain) {
    yield* put(aggregatorActions.setSubmitError('Could not find contracts'));
    return;
  }

  if (!tokenAddress || !massetAddress || !tokenDecimals || !account) {
    yield* put(aggregatorActions.setSubmitError('Could not find addresses'));
    return;
  }

  const isRSK =
    startingChain === ChainEnum.RSK || startingChain === ChainEnum.RSK_TESTNET;
  const amount = utils.parseUnits(payload.SendAmount, tokenDecimals);
  const spender = isRSK ? massetAddress : bridge.address.toLowerCase();
  const extraData = utils.defaultAbiCoder.encode(['address'], [receiver]);
  const allowanceSpender = yield* call(
    tokenContract.allowance,
    account.toLowerCase(),
    bridge.address
  );
  const steps: SagaContractCallStep<AggregatorCalls>[] = [];

  if (allowanceSpender.lt(amount)) {
    if (allowanceSpender.gt(0)) {
      const resetEffect = call(tokenContract.approve, spender, 0);

      steps.push({
        name: 'reset allowance',
        effect: resetEffect,
      });
    }
    const approveEffect = call(tokenContract.approve, spender, amount);

    steps.push({
      name: 'approve',
      effect: approveEffect,
    });
  }

  let submitEffect: SagaContactEffect;

  if (isRSK) {
    submitEffect = call(massetContract.mintTo, tokenAddress, amount, receiver);
  } else {
    submitEffect = call(
      bridge.receiveTokensAt,
      tokenAddress,
      amount,
      massetAddress,
      extraData
    );
  }

  steps.push({
    name: 'deposit',
    effect: submitEffect,
  });

  yield* put(aggregatorActions.setSubmitSteps(steps));
  yield* contractStepCallsSaga<AggregatorCalls>({
    steps,
    setErrorAction: aggregatorActions.setSubmitError,
    setStatusAction: aggregatorActions.setSubmitStatus,
    setStepDataAction: aggregatorActions.setSubmitStepData,
  });
}

export function* withdrawTokens({ payload }: AggregatorActions['submit']) {
  const tokenDecimals = yield* select(startingTokenDecimalsSelector);
  const tokenContract = yield* select(startingTokenContractSelector);
  const bassetAddress = yield* select(bassetAddressSelector);
  const massetContract = yield* select(massetContractSelector);
  const account = yield* select(accountSelector);
  const { DestinationChain: destinationChain, ReceiveAddress: receiver } =
    payload;

  if (!massetContract || !tokenContract || !destinationChain) {
    yield* put(aggregatorActions.setSubmitError('Could not find contracts'));
    return;
  }

  if (!bassetAddress || !account) {
    yield* put(aggregatorActions.setSubmitError('Could not find addresses'));
    return;
  }

  const amount = utils.parseUnits(payload.SendAmount, tokenDecimals);
  const allowanceMasset = yield* call(
    tokenContract.allowance,
    account,
    massetContract.address.toLowerCase()
  );
  const steps: SagaContractCallStep<AggregatorCalls>[] = [];

  if (allowanceMasset.lt(amount)) {
    const approveEffect = call(
      tokenContract.approve,
      massetContract.address.toLowerCase(),
      amount
    );

    steps.push({
      name: 'approve',
      effect: approveEffect,
    });
  }

  const isRSK =
    destinationChain === ChainEnum.RSK ||
    destinationChain === ChainEnum.RSK_TESTNET;
  let submitEffect: SagaContactEffect;

  if (isRSK) {
    submitEffect = call(
      massetContract.redeemTo,
      bassetAddress,
      amount,
      receiver
    );
  } else {
    submitEffect = call(
      massetContract['redeemToBridge(address,uint256,address)'],
      bassetAddress,
      amount,
      receiver
    );
  }

  steps.push({
    name: 'withdraw',
    effect: submitEffect,
  });

  yield* put(aggregatorActions.setSubmitSteps(steps));
  yield* contractStepCallsSaga<AggregatorCalls>({
    steps,
    setErrorAction: aggregatorActions.setSubmitError,
    setStatusAction: aggregatorActions.setSubmitStatus,
    setStepDataAction: aggregatorActions.setSubmitStepData,
  });
}

export function* transferTokens(action: AggregatorActions['submit']) {
  const flowState = yield* select(flowStateSelector);

  if (flowState === 'deposit') {
    yield* depositTokens(action);
  } else if (flowState === 'withdraw') {
    yield* withdrawTokens(action);
  }
}
