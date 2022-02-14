import { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';

export type DatesFilterConfig = {
  kickoffTs: number;
  stakes: number[];
  value: number | undefined;
  onChange: (timestamp: number | undefined) => void;
};

export type UseDateSelectorConfig = Pick<
  DatesFilterConfig,
  'kickoffTs' | 'stakes'
>;

export type GetAvailableDatesConfig = Pick<
  DatesFilterConfig,
  'kickoffTs' | 'stakes'
>;

export type DateForYear = {
  month: number;
  timestamp: number;
  date: Date;
};

export type GroupedDates = {
  [monthName: string]: DateForYear[];
};

export type DateSelectorProps = DatesFilterConfig;

export type DatesInMonthProps = {
  dates: DateForYear[];
  handleSelectDate: ToggleButtonGroupProps['onChange'];
  monthNumber: number;
  selectedDate?: number;
};
