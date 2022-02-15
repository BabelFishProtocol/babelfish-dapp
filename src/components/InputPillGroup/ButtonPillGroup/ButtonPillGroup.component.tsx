import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { ButtonPillGroupProps } from './ButtonPillGroup.types';

export const ButtonPillGroup = ({
  availableValues,
  disabled,
  value,
  handleChange,
}: ButtonPillGroupProps) => (
  <ToggleButtonGroup
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      py: 1.5,
      gap: 0.5,
      width: '100%',
    }}
    exclusive
    value={value}
    onChange={handleChange}
  >
    {availableValues.map((percentValue) => (
      <ToggleButton
        color="primary"
        size="small"
        value={percentValue}
        disabled={disabled}
        aria-label={`${percentValue}%`}
      >
        {percentValue === 100 ? `MAX` : `${percentValue}%`}
      </ToggleButton>
    ))}
  </ToggleButtonGroup>
);
