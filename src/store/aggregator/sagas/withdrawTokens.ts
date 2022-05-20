import { utils } from 'ethers';
import { call, put, select } from 'typed-redux-saga';
import { SUPPORTED_CHAINS_RSK } from '../../../config/chains';
import {
  accountSelector,
  massetContractSelector,
} from '../../app/app.selectors';
import { SagaContractEffect, SagaContractCallStep } from '../../types';
import { contractStepCallsSaga } from '../../utils/utils.sagas';
import {
  bassetAddressSelector,
  destinationTokenAddressSelector,
  startingTokenContractSelector,
  startingTokenDecimalsSelector,
} from '../aggregator.selectors';
import { AggregatorActions, aggregatorActions } from '../aggregator.slice';
import { AggregatorCalls } from '../aggregator.state';

export function* withdrawTokens({ payload }: AggregatorActions['submit']) {
  const tokenDecimals = yield* select(startingTokenDecimalsSelector);
  const tokenContract = yield* select(startingTokenContractSelector);
  const destinationTokenAddress = yield* select(
    destinationTokenAddressSelector
  );
  const bassetAddress = yield* select(bassetAddressSelector);
  const massetContract = yield* select(massetContractSelector);
  const account = yield* select(accountSelector);
  const { destinationChain, receiveAddress } = payload;

  if (!massetContract || !tokenContract || !destinationChain) {
    yield* put(aggregatorActions.setSubmitError('Could not find contracts'));
    return;
  }

  const isRSK = SUPPORTED_CHAINS_RSK.includes(destinationChain);
  if ((!isRSK && !bassetAddress) || !destinationTokenAddress || !account) {
    yield* put(aggregatorActions.setSubmitError('Could not find addresses'));
    return;
  }

  yield* put(
    aggregatorActions.setTransactionDetails({
      amount: payload.sendAmount,
      user: account,
      event: 'Withdraw',
    })
  );

  const amount = utils.parseUnits(payload.sendAmount, tokenDecimals);
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

  let submitEffect: SagaContractEffect;

  if (isRSK) {
    submitEffect = call(
      massetContract.redeemTo,
      destinationTokenAddress,
      amount,
      receiveAddress.toLowerCase()
    );
  } else {
    submitEffect = call(
      massetContract['redeemToBridge(address,uint256,address)'],
      bassetAddress as string,
      amount,
      receiveAddress.toLowerCase()
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
