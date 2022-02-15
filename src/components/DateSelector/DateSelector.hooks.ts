import { useMemo, useState } from 'react';
import { UseDateSelectorConfig } from './DateSelector.types';
import {
  getAvailableDates,
  getAvailableYears,
  getDatesForYear,
} from './DateSelector.utils';

export const useDateSelector = ({
  stakes,
  kickoffTs,
}: UseDateSelectorConfig) => {
  const [selectedYear, setSelectedYear] = useState<number>();

  const { availableDates, dates } = useMemo(
    () => getAvailableDates({ stakes, kickoffTs }),
    [kickoffTs, stakes]
  );

  const availableDatesForYear = useMemo(
    () => getDatesForYear(dates, selectedYear),
    [dates, selectedYear]
  );

  const availableYears = getAvailableYears(availableDates);

  return {
    selectedYear,
    availableDates,
    availableYears,
    setSelectedYear,
    availableDatesForYear,
  };
};
