import { utils } from 'ethers';
import { call, put, select } from 'typed-redux-saga';
import {
  checkIsCrossChain,
  SUPPORTED_CHAINS_RSK,
} from '../../../config/chains';
import { DEFAULT_ASSET_DECIMALS } from '../../../constants';
import { IEvent } from '../../../gql/graphql';
import { parseToWei } from '../../../utils/helpers';
import { accountSelector } from '../../app/app.selectors';
import { SagaContractEffect, SagaContractCallStep } from '../../types';
import { contractStepCallsSaga } from '../../utils/utils.sagas';
import {
  bassetAddressSelector,
  destinationTokenAddressSelector,
  massetContractSelector,
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
  const { destinationChain, receiveAddress, sendAmount } = payload;

  if (!massetContract || !tokenContract || !destinationChain) {
    yield* put(aggregatorActions.setSubmitError('Could not find contracts'));
    return;
  }

  const isRSK = SUPPORTED_CHAINS_RSK.includes(destinationChain);
  if ((!isRSK && !bassetAddress) || !destinationTokenAddress || !account) {
    yield* put(aggregatorActions.setSubmitError('Could not find addresses'));
    return;
  }

  // we have to attach some transaction details into state,
  // it will be use to save this transaction in local storage
  const isCrossChain = checkIsCrossChain(destinationChain);
  yield* put(
    aggregatorActions.setTransactionDetails({
      amount: parseToWei(sendAmount),
      user: account,
      event: IEvent.Withdraw,
      status: 'Pending',
      isCrossChain,
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

  const maximumPenaltyNumber = Number(payload.sendAmount) * payload.slippageSlider / 100;
  const maximumPenalty = utils.parseUnits(maximumPenaltyNumber.toString(), DEFAULT_ASSET_DECIMALS);

  if (isRSK) {
    submitEffect = call(
      massetContract.redeemToWithMaximumPenalty,
      destinationTokenAddress.toLowerCase(),
      amount,
      receiveAddress.toLowerCase(),
      maximumPenalty
    );
  } else {
    submitEffect = call(
      massetContract.redeemToBridgeWithMaximumPenalty,
      (bassetAddress as string).toLowerCase(),
      amount,
      receiveAddress.toLowerCase(),
      maximumPenalty
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
