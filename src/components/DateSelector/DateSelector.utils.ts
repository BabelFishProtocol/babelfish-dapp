import { timestampToDate } from '../../utils/helpers';
import { MAX_STAKING_PERIODS, TWO_WEEKS } from '../../constants';
import {
  GroupedDates,
  CheckpointInfo,
  GetAvailableDatesConfig,
} from './DateSelector.types';

export const getAllCheckpoints = (kickoffTs: number) => {
  const dates: number[] = [];

  for (let i = 1; i <= MAX_STAKING_PERIODS; i++) {
    const date = kickoffTs + TWO_WEEKS * i;
    dates.push(date);
  }

  return dates;
};

export const getAvailableDates = ({
  kickoffTs,
  stakes,
  prevDate,
}: GetAvailableDatesConfig) => {
  const currentCheckpoint = Math.trunc(Date.now() / 1000) + TWO_WEEKS;
  const allDates = getAllCheckpoints(kickoffTs);

  const dates: CheckpointInfo[] = allDates.map((timestamp) => {
    const convertedDate = timestampToDate(timestamp);
    const month = convertedDate.getMonth();

    return {
      month,
      timestamp,
      date: convertedDate,
      isPast: timestamp <= currentCheckpoint,
      isAlreadyUsed: stakes.includes(timestamp),
      isBeforePrevDate: !!prevDate && prevDate >= timestamp,
    };
  });

  const availableDates = dates.filter(
    (date) => !date.isAlreadyUsed && !date.isPast && !date.isBeforePrevDate
  );

  return { availableDates, dates };
};

export const getAvailableYears = (availableDates: CheckpointInfo[]) =>
  availableDates
    .map((date) => timestampToDate(date.timestamp).getFullYear())
    .filter((year, index, arr) => arr.indexOf(year) === index);

export const getDatesForYear = (
  dates: CheckpointInfo[],
  year: number | undefined
): GroupedDates => {
  if (!year) {
    return {};
  }

  const groupedDates = dates
    .filter((date) => timestampToDate(date.timestamp).getFullYear() === year)
    .reduce((prev, curr) => {
      const { month } = curr;

      if (Array.isArray(prev[month])) {
        prev[month].push(curr);
      } else {
        prev[month] = [curr];
      }

      return prev;
    }, {} as GroupedDates);

  return groupedDates;
};
