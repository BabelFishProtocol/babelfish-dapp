import { Store } from '@reduxjs/toolkit';
import { BigNumber, utils } from 'ethers';

import { getStore } from '..';
import {
  bridgeFeeSelector,
  dailyLimitSelector,
  maxTransferSelector,
  minTransferSelector,
} from './aggregator.selectors';
import { aggregatorActions } from './aggregator.slice';

describe('aggregator store', () => {
  let store: Store;

  beforeEach(() => {
    store = { ...getStore() };
  });

  it('selectors work properly', () => {
    const newBridgeFee = BigNumber.from(utils.parseEther('0.001'));
    const newDailyLimit = BigNumber.from(utils.parseEther('1000000000'));
    const newMinTransfer = BigNumber.from(utils.parseEther('0.01'));
    const newMaxTransfer = BigNumber.from(utils.parseEther('0.01'));

    store.dispatch(aggregatorActions.setBridgeFee(newBridgeFee));
    store.dispatch(aggregatorActions.setDailyLimit(newDailyLimit));
    store.dispatch(aggregatorActions.setMinTransfer(newMinTransfer));
    store.dispatch(aggregatorActions.setMaxTransfer(newMaxTransfer));

    expect(bridgeFeeSelector(store.getState())).toBe(newBridgeFee);
    expect(dailyLimitSelector(store.getState())).toBe(newDailyLimit);
    expect(minTransferSelector(store.getState())).toBe(newMinTransfer);
    expect(maxTransferSelector(store.getState())).toBe(newMaxTransfer);
  });
});
