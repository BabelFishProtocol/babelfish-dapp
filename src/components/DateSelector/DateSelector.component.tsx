import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { monthNames } from '../../constants';

import { useDateSelector } from './DateSelector.hooks';
import {
  CheckpointInfo,
  DateSelectorProps,
  DatesInMonthProps,
  ToggleButtonWithTooltipProps,
} from './DateSelector.types';

export const DateSelector = ({
  stakes,
  value,
  onChange,
  kickoffTs,
  prevDate,
}: DateSelectorProps) => {
  const {
    selectedYear,
    availableYears,
    setSelectedYear,
    availableDatesForYear,
  } = useDateSelector({ stakes, kickoffTs, prevDate });

  const onChangeDate = (_: React.MouseEvent, val: string) => {
    onChange(Number(val));
  };
  const onChangeYear = (_: React.MouseEvent, val: string) => {
    setSelectedYear(Number(val));
    onChange(undefined);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" sx={{ mb: 1.5 }}>
        Select Date
      </Typography>
      <ToggleButtonGroup
        exclusive
        color="primary"
        value={selectedYear}
        onChange={onChangeYear}
        sx={{ gap: 0.5 }}
      >
        {availableYears.map((year) => (
          <ToggleButton key={year} value={year} sx={{ px: 4, py: 1 }}>
            {year}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {!!selectedYear && (
        <Box
          sx={{
            mt: 2,
            gap: 0.5,
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          {monthNames.map((monthName, index) => (
            <DatesInMonth
              key={`${index}_${selectedYear}`}
              selectedDate={value}
              monthName={monthName}
              handleSelectDate={onChangeDate}
              dates={availableDatesForYear[index]}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const DatesInMonth = ({
  dates = [],
  monthName,
  selectedDate = 0,
  handleSelectDate,
}: DatesInMonthProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
    }}
  >
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      {monthName}
    </Typography>
    <ToggleButtonGroup
      exclusive
      orientation="vertical"
      value={selectedDate}
      onChange={handleSelectDate}
      sx={{ gap: 0.5, width: '100%' }}
    >
      {dates.map((dateInfo) => (
        <ToggleButtonWithTooltip
          color="primary"
          dateInfo={dateInfo}
          sx={{ width: '100%' }}
          key={dateInfo.timestamp}
          value={dateInfo.timestamp}
          disabled={
            dateInfo.isPast ||
            dateInfo.isAlreadyUsed ||
            dateInfo.isBeforePrevDate
          }
        >
          {dateInfo.date.getDate()}
        </ToggleButtonWithTooltip>
      ))}
    </ToggleButtonGroup>
  </Box>
);

const ToggleButtonWithTooltip = ({
  dateInfo,
  ...buttonProps
}: ToggleButtonWithTooltipProps) => (
  <Tooltip title={getTooltipMessage(dateInfo)} placement="bottom" arrow>
    <div>
      <ToggleButton {...buttonProps} />
    </div>
  </Tooltip>
);

const getTooltipMessage = (dateInfo: CheckpointInfo) => {
  if (dateInfo.isBeforePrevDate)
    return 'Cannot use dates prior to current stake';
  if (dateInfo.isPast) return 'Cannot use past dates';
  if (dateInfo.isAlreadyUsed) return 'You already have a stake on this date';
  return '';
};
