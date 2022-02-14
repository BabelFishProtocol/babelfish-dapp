import { timeStampToDate } from '../../utils/helpers';
import { MAX_STAKING_PERIODS, TWO_WEEKS } from '../../constants';
import {
  DateForYear,
  GroupedDates,
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
}: GetAvailableDatesConfig) => {
  const currentCheckpoint = Math.trunc(Date.now() / 1000) + TWO_WEEKS;
  const allDates = getAllCheckpoints(kickoffTs);

  // filter dates that are not in the future timestamps
  const futureStakes = allDates.filter((date) => date > currentCheckpoint);
  // dates that user has already stakes in
  const disabledDates = allDates.filter((date) => stakes.includes(date));

  const availableDates = futureStakes.filter(
    (date) => !disabledDates.includes(date)
  );

  return availableDates;
};

export const getAvailableYears = (availableDates: number[]) =>
  availableDates
    .map((date) => timeStampToDate(date).getFullYear())
    .filter((year, index, arr) => arr.indexOf(year) === index);

export const getDatesForYear = (
  availableDates: number[],
  year: number | undefined
): GroupedDates => {
  if (!year) {
    return {};
  }

  const groupedDates = availableDates
    .filter((date) => timeStampToDate(date).getFullYear() === year)
    .reduce((prev, curr) => {
      const convertedDate = timeStampToDate(curr);
      const month = convertedDate.getMonth();

      const dateInfo: DateForYear = {
        month,
        date: convertedDate,
        timestamp: curr,
      };

      if (Array.isArray(prev[month])) {
        prev[month].push(dateInfo);
      } else {
        // eslint-disable-next-line no-param-reassign
        prev[month] = [dateInfo];
      }

      return prev;
    }, {} as GroupedDates);

  return groupedDates;
};
