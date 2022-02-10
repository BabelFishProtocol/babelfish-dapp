import { alpha } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import { ButtonPillProps } from './ButtonPillGroup.types';

export const ButtonPill = ({ value, isSelected, onClick }: ButtonPillProps) => (
  <ButtonBase
    sx={({ palette }) => ({
      flexGrow: 1,
      py: 0.5,
      borderRadius: '12px',
      fontSize: '12px',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: isSelected ? palette.primary.main : palette.grey[600],
      color: isSelected ? palette.primary.main : 'white',
      backgroundColor: isSelected
        ? alpha(palette.primary.main, 0.2)
        : 'rgba(255,255,255, 0.2)',
    })}
    onClick={onClick}
  >
    {value === 100 ? `MAX` : `${value}%`}
  </ButtonBase>
);
