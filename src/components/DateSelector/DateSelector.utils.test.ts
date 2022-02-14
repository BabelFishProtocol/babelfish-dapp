import { timeStampToDate } from '../../utils/helpers';
import { GroupedDates } from './DateSelector.types';
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
  it('getAllCheckpoints', () => {
    const kickoffTs = 100;
    const expectedCheckpoints = [200, 300, 400, 500, 600];

    expect(getAllCheckpoints(kickoffTs)).toEqual(expectedCheckpoints);
  });

  it.only('getAvailableDates', () => {
    const kickoffTs = 100;
    const stakes = [300, 500];
    /**
     * 200 and 300 should be disabled since they are in the current or previous checkpoints
     * 500 should be disabled due to stake present on that timestamp
     */
    const expectedDates = [400, 600];

    expect(getAvailableDates({ kickoffTs, stakes })).toEqual(expectedDates);
  });

  it('getAvailableYears', () => {
    const availableDates = [
      1609455600, // 01.01.2021
      1636585200, // 11.11.2021
      1641078000, // 01.02.2022
      1672614000, // 01.02.2023
      1699657200, // 11.11.2023
    ];
    const expectedYears = [2021, 2022, 2023];

    expect(getAvailableYears(availableDates)).toEqual(expectedYears);
  });

  it('getDatesForYear', () => {
    const availableDates = [
      1609455600, // 01.01.2021
      1636585200, // 11.11.2021
      1641078000, // 01.02.2022
      1672614000, // 01.02.2023
      1699657200, // 11.11.2023
    ];
    const year = 2023;
    const expectedDates: GroupedDates = {
      '0': [
        { date: timeStampToDate(1672614000), month: 0, timestamp: 1672614000 },
      ],
      '10': [
        { date: timeStampToDate(1699657200), month: 10, timestamp: 1699657200 },
      ],
    };

    expect(getDatesForYear(availableDates, year)).toEqual(expectedDates);
  });
});
