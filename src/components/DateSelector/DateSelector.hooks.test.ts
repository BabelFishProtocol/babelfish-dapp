import { renderHook, act } from '@testing-library/react-hooks';
import { TWO_WEEKS } from '../../constants';
import { timestampToDate } from '../../utils/helpers';

import { useDateSelector } from './DateSelector.hooks';
import { CheckpointInfo } from './DateSelector.types';

const currentTime = 1636585200; // 2021-11-11

jest.mock('../../constants', () => ({
  ...jest.requireActual('../../constants'),
  MAX_STAKING_PERIODS: 48,
}));

jest.useFakeTimers().setSystemTime(currentTime);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useDateSelector', () => {
  it('works fine with proper stake list', () => {
    const kickoffTs = 1635379200; // 2021-10-28
    const stakes = [
      1639008000, // 2021-12-09
      1641427200, // 2022-01-06
      1642636800, // 2022-01-20
      1645056000, // 2022-02-17
      1659571200, // 2022-08-04
      1677715200, // 2023-03-02
    ];
    const { result } = renderHook(() => useDateSelector({ stakes, kickoffTs }));

    // should filter out current, previous and already used checkpoints
    expect(result.current.availableDates).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          timestamp: kickoffTs,
        } as CheckpointInfo),
      ])
    );
    stakes.forEach((stake) => {
      expect(result.current.availableDates).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            timestamp: stake,
          } as CheckpointInfo),
        ])
      );
    });

    const someRandomStakesInTheFuture = [
      kickoffTs + TWO_WEEKS * 11,
      kickoffTs + TWO_WEEKS * 21,
      kickoffTs + TWO_WEEKS * 48,
    ];

    // stake checkpoints in the future should be available
    someRandomStakesInTheFuture.forEach((timestamp) => {
      expect(result.current.availableDates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            timestamp,
            isPast: false,
            isAlreadyUsed: false,
          } as CheckpointInfo),
        ])
      );
    });

    expect(result.current.availableDatesForYear).toEqual({});
    expect(result.current.availableYears).toEqual([2021, 2022, 2023]);
    expect(result.current.selectedYear).toBeUndefined();

    // ----- select a year -----

    act(() => {
      result.current.setSelectedYear(2022);
    });

    expect(result.current.selectedYear).toBe(2022);
    const datesForSelectedYear = result.current.availableDatesForYear;

    expect(Object.keys(datesForSelectedYear)).toEqual([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
    ]);

    const expectedAvailableCheckpointsFebuary: CheckpointInfo[] = [
      {
        date: timestampToDate(1643846400), // 2022-02-03
        timestamp: 1643846400,
        month: 1,
        isAlreadyUsed: false,
        isPast: false,
        isBeforePrevDate: false,
      },
      {
        date: timestampToDate(1645056000),
        isAlreadyUsed: true,
        isPast: false,
        month: 1,
        timestamp: 1645056000,
        isBeforePrevDate: false,
      },
    ];

    expect(datesForSelectedYear['1']).toEqual(
      expectedAvailableCheckpointsFebuary
    );
  });
});
