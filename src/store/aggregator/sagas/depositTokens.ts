import { utils } from 'ethers';
import { call, put, select } from 'typed-redux-saga';
import { ChainEnum, SUPPORTED_CHAINS_RSK } from '../../../config/chains';
import {
  accountSelector,
  massetContractSelector,
} from '../../app/app.selectors';
import { SagaContractEffect, SagaContractCallStep } from '../../types';
import { contractStepCallsSaga } from '../../utils/utils.sagas';
import {
  bridgeContractSelector,
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
  const { startingChain, receiveAddress } = payload;
  const isRSK = SUPPORTED_CHAINS_RSK.includes(startingChain as ChainEnum);

  if (
    !massetContract ||
    !tokenContract ||
    (!isRSK && !bridge) ||
    !startingChain
  ) {
    yield* put(aggregatorActions.setSubmitError('Could not find contracts'));
    return;
  }

  if (!tokenAddress || !massetAddress || !tokenDecimals || !account) {
    yield* put(aggregatorActions.setSubmitError('Could not find addresses'));
    return;
  }

  yield* put(
    aggregatorActions.setTransactionDetails({
      amount: payload.sendAmount,
      user: account,
      event: 'Deposit',
    })
  );

  const amount = utils.parseUnits(payload.sendAmount, tokenDecimals);
  const spender = isRSK ? massetAddress : bridge!.address.toLowerCase();
  const allowanceSpender = yield* call(
    tokenContract.allowance,
    account.toLowerCase(),
    spender
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

  let submitEffect: SagaContractEffect;

  if (isRSK) {
    submitEffect = call(
      massetContract.mintTo,
      tokenAddress,
      amount,
      receiveAddress.toLowerCase()
    );
  } else {
    const extraData = utils.defaultAbiCoder.encode(
      ['address'],
      [receiveAddress.toLowerCase()]
    );
    submitEffect = call(
      bridge!.receiveTokensAt,
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
