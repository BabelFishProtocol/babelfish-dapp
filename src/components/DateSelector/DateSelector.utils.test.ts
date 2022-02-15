import { timestampToDate } from '../../utils/helpers';
import { CheckpointInfo, GroupedDates } from './DateSelector.types';
import {
  getDatesForYear,
  getAllCheckpoints,
  getAvailableDates,
  getAvailableYears,
} from './DateSelector.utils';

const currentTime = 250000;

jest.mock('../../constants', () => ({
  ...jest.requireActual('../../constants'),
  MAX_STAKING_PERIODS: 5,
  TWO_WEEKS: 100,
}));

jest.useFakeTimers().setSystemTime(currentTime);

afterEach(() => {
  jest.clearAllMocks();
});

describe('DateSelector utils', () => {
  const availableDates: CheckpointInfo[] = [
    {
      // 01.01.2021
      month: 0,
      timestamp: 1609555600,
      date: timestampToDate(1609555600),
      isPast: false,
      isAlreadyUsed: false,
    },
    {
      // 11.11.2021
      month: 10,
      timestamp: 1636585200,
      date: timestampToDate(1636585200),
      isPast: false,
      isAlreadyUsed: false,
    },
    {
      // 01.02.2022
      month: 1,
      timestamp: 1641078000,
      date: timestampToDate(1641078000),
      isPast: false,
      isAlreadyUsed: false,
    },
    {
      // 01.02.2023
      month: 0,
      timestamp: 1672614000,
      date: timestampToDate(1672614000),
      isPast: false,
      isAlreadyUsed: false,
    },
    {
      // 11.11.2023
      month: 10,
      timestamp: 1699657200,
      date: timestampToDate(1699657200),
      isPast: false,
      isAlreadyUsed: false,
    },
  ];

  it('getAllCheckpoints', () => {
    const kickoffTs = 100;
    const expectedCheckpoints = [200, 300, 400, 500, 600];

    expect(getAllCheckpoints(kickoffTs)).toEqual(expectedCheckpoints);
  });

  it('getAvailableDates', () => {
    const kickoffTs = 100;
    const stakes = [300, 500];
    /**
     * 200 and 300 should be disabled since they are in the current or previous checkpoints
     * 500 should be disabled due to stake present on that timestamp
     */
    // const expectedDates: CheckpointInfo[] = [400, 600];
    const expectedDates: CheckpointInfo[] = [
      {
        month: 0,
        timestamp: 200,
        date: timestampToDate(200),
        isPast: true,
        isAlreadyUsed: false,
      },
      {
        month: 0,
        timestamp: 300,
        date: timestampToDate(300),
        isPast: true,
        isAlreadyUsed: true,
      },
      {
        month: 0,
        timestamp: 400,
        date: timestampToDate(400),
        isPast: false,
        isAlreadyUsed: false,
      },
      {
        month: 0,
        timestamp: 500,
        date: timestampToDate(500),
        isPast: false,
        isAlreadyUsed: true,
      },
      {
        month: 0,
        timestamp: 600,
        date: timestampToDate(600),
        isPast: false,
        isAlreadyUsed: false,
      },
    ];

    const expectedAvailableDates: CheckpointInfo[] = [
      {
        month: 0,
        timestamp: 400,
        date: timestampToDate(400),
        isPast: false,
        isAlreadyUsed: false,
      },
      {
        month: 0,
        timestamp: 600,
        date: timestampToDate(600),
        isPast: false,
        isAlreadyUsed: false,
      },
    ];

    expect(getAvailableDates({ kickoffTs, stakes })).toEqual({
      dates: expectedDates,
      availableDates: expectedAvailableDates,
    });
  });

  it('getAvailableYears', () => {
    const expectedYears = [2021, 2022, 2023];

    expect(getAvailableYears(availableDates)).toEqual(expectedYears);
  });

  it('getDatesForYear', () => {
    const year = 2023;
    const expectedDates: GroupedDates = {
      '0': [
        {
          // 01.02.2023
          month: 0,
          timestamp: 1672614000,
          date: timestampToDate(1672614000),
          isPast: false,
          isAlreadyUsed: false,
        },
      ],
      '10': [
        {
          // 11.11.2023
          month: 10,
          timestamp: 1699657200,
          date: timestampToDate(1699657200),
          isPast: false,
          isAlreadyUsed: false,
        },
      ],
    };

    expect(getDatesForYear(availableDates, year)).toEqual(expectedDates);
  });
});
