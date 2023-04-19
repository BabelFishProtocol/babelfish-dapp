import dayjs from 'dayjs';
import { getCurrentTimestamp, timestampToDate } from '../../utils/helpers';
import { MAX_STAKING_PERIODS, MS, TWO_WEEKS } from '../../constants';
import {
  GroupedDates,
  CheckpointInfo,
  GetAvailableDatesConfig,
} from './DateSelector.types';

export const getAllCheckpoints = (
  kickoffTs: number,
  stakeEndDate: number | undefined
) => {
  const currentDate = new Date();

  const contractDate = dayjs(kickoffTs * MS).toDate();
  const contractOffset = contractDate.getTimezoneOffset() / 60;
  const currentUserOffset = currentDate.getTimezoneOffset() / 60;

  let contractDateDeployed = dayjs(kickoffTs * MS).add(contractOffset, 'hour'); // get contract date in UTC-0
  const userDateUTC = dayjs(currentDate).add(currentUserOffset, 'hour'); // get user offset

  const dates: number[] = [];

  const stakeExtensionDates: number[] = [];

  // getting the last possible date before the current date
  for (let i = 1; contractDateDeployed.unix() < userDateUTC.unix(); i++) {
    const intervalDate = contractDateDeployed.add(2, 'week');
    contractDateDeployed = intervalDate;
  }

  for (let i = 1; i < MAX_STAKING_PERIODS; i++) {
    if (contractDateDeployed.unix() > userDateUTC.unix()) {
      const date = contractDateDeployed.add(2, 'week');
      contractDateDeployed = date;

      // If we just add a new stake, we can return all dates in the future
      if (!stakeEndDate) {
        dates.push(date.unix());
      }

      // In case we extend an existing stake, we cannot return dates before the stake end date
      if (
        stakeEndDate &&
        dayjs(stakeEndDate * MS)
          .add(contractOffset, 'hour')
          .toDate()
          .getTime() /
          MS <
          date.unix()
      ) {
        stakeExtensionDates.push(date.unix());
      }
    }
  }
  if (stakeExtensionDates.length) {
    return stakeExtensionDates;
  }

  return dates;
};

export const getAvailableDates = ({
  kickoffTs,
  stakes,
  prevDate,
}: GetAvailableDatesConfig) => {
  const currentCheckpoint = Math.trunc(getCurrentTimestamp()) + TWO_WEEKS;
  const allDates = getAllCheckpoints(kickoffTs, prevDate);

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
