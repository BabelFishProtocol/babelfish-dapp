import { renderHook, act } from '@testing-library/react-hooks';

import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('returns initial value', () => {
    const initialValue = '155';

    const data = renderHook(() => useDebounce(initialValue, 1000));

    expect(data.result.current).toEqual('155');
  });

  it('returns correct value after timeout', () => {
    let initialValue = '155';

    const data = renderHook(() => useDebounce(initialValue, 1000));

    expect(data.result.current).toEqual('155');

    initialValue = '15555';
    data.rerender();

    expect(data.result.current).toEqual('155');

    act(() => {
      jest.runAllTimers();
    });

    expect(data.result.current).toEqual('15555');
  });
});
