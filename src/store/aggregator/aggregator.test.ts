import { Store } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';

import { getStore } from '..';
import { bridgeFeeSelector } from './aggregator.selectors';
import { aggregatorActions } from './aggregator.slice';

describe('aggregator store', () => {
  let store: Store;

  beforeEach(() => {
    store = { ...getStore() };
  });

  it('selectors work properly', () => {
    const newBridgeFee = BigNumber.from(30);
    store.dispatch(aggregatorActions.setBridgeFee(newBridgeFee));

    expect(bridgeFeeSelector(store.getState())).toBe(newBridgeFee);
  });
});
