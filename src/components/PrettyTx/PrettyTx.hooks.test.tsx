import { renderHook } from '@testing-library/react-hooks';
import { ReactElement } from 'react';
import { Provider, useSelector } from 'react-redux';
import { useUpdatePrettyTxUrl } from './PrettyTx.hooks';
import { store } from '../../store';
import { AppState } from '../../store/app/app.state';
import { Reducers } from '../../constants';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const initialState = {
  ...store,
  [Reducers.App]: {
    ...new AppState(),
    chainId: '0x1e',
  },
};

describe('useUpdatePrettyTxUrl', () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((callback) =>
      callback(initialState)
    );
  });

  const wrapper = ({ children }: { children: ReactElement }) => (
    <Provider store={initialState}>{children}</Provider>
  );

  const txMock =
    '0x915b631561121446596028f06f92a8874e4dd752042ef00be1fbe07c518837d6';
  const addressMock = '0x1d66e98984e10d62a09983b6b1b26485979b4788';
  it('return url to explorer page with address data', async () => {
    const { result } = renderHook(() => useUpdatePrettyTxUrl(addressMock), {
      wrapper,
    });
    expect(result.current).toEqual(
      `https://explorer.rsk.co/address/${addressMock}`
    );
  });
  it('return url to explorer page with transaction data', async () => {
    const { result } = renderHook(() => useUpdatePrettyTxUrl(txMock), {
      wrapper,
    });
    expect(result.current).toEqual(`https://explorer.rsk.co/tx/${txMock}`);
  });
  it('return url to explorer page with transaction data', async () => {
    const { result } = renderHook(() => useUpdatePrettyTxUrl(''), {
      wrapper,
    });
    expect(result.current).toBeUndefined();
  });
});
