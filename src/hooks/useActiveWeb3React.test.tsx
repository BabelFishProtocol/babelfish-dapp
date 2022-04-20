import { renderHook } from '@testing-library/react-hooks';
import { ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useActiveWeb3React } from './useActiveWeb3React';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useActiveWeb3React', () => {
  const wrapper = ({ children }: { children: ReactElement }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('tries to connect eagerly, but fails (no wallet)', async () => {
    const { result, waitForNextUpdate } = renderHook(useActiveWeb3React, {
      wrapper,
    });

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.all.length).toBe(2); // tried to connect eagerly
    expect(result.current.active).toBe(false);
  });
});
