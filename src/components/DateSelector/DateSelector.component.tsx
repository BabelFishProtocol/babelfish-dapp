import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { monthNames } from '../../constants';

import { useDateSelector } from './DateSelector.hooks';
import { DateSelectorProps, DatesInMonthProps } from './DateSelector.types';

export const DateSelector = ({
  stakes,
  value,
  onChange,
  kickoffTs,
}: DateSelectorProps) => {
  const {
    selectedYear,
    availableYears,
    setSelectedYear,
    availableDatesForYear,
  } = useDateSelector({ stakes, kickoffTs });

  const onChangeDate = (_: React.MouseEvent, val: string) => {
    onChange(Number(val));
  };
  const onChangeYear = (_: React.MouseEvent, val: string) => {
    setSelectedYear(Number(val));
    onChange(undefined);
  };

  return (
    <>
      <Typography variant="h3" sx={{ my: 2 }}>
        Select year:
      </Typography>
      <ToggleButtonGroup
        exclusive
        color="primary"
        value={selectedYear}
        onChange={onChangeYear}
        sx={{ gap: 0.5 }}
      >
        {availableYears.map((year) => (
          <ToggleButton key={year} value={year}>
            {year}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {selectedYear && (
        <>
          <Typography variant="h3" sx={{ my: 2 }}>
            Select date:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 0.5 }}>
            {Object.entries(availableDatesForYear).map(([month, dates]) => (
              <DatesInMonth
                key={`${month}_${selectedYear}`}
                dates={dates}
                selectedDate={value}
                monthNumber={Number(month)}
                handleSelectDate={onChangeDate}
              />
            ))}
          </Box>
        </>
      )}
    </>
  );
};

const DatesInMonth = ({
  dates,
  monthNumber,
  selectedDate = 0,
  handleSelectDate,
}: DatesInMonthProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      {monthNames[Number(monthNumber)]}
    </Typography>
    <ToggleButtonGroup
      exclusive
      orientation="vertical"
      value={selectedDate}
      onChange={handleSelectDate}
      sx={{ gap: 0.5 }}
    >
      {dates.map((dateInfo) => (
        <ToggleButton
          color="primary"
          sx={{ width: 50 }}
          key={dateInfo.timestamp}
          value={dateInfo.timestamp}
        >
          {dateInfo.date.getDate()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Box>
);
