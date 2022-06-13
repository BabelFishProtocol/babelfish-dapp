import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { WalletIcon } from '../WalletIcon/WalletIcon.component';
import { WalletOptionProps } from './WalletOption.types';

export const WalletOption = ({
  index,
  name,
  icon,
  handleClick,
  autoFocus,
}: WalletOptionProps) => (
  <MenuItem
    autoFocus={autoFocus}
    onClick={() => {
      handleClick(index);
    }}
    sx={{
      width: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 2,
      px: 2,
      py: 1,
      borderRadius: '6px',
      border: 'solid 2px rgba(0, 0, 0, 0.4)',
      backgroundColor: ({ palette }) => alpha(palette.common.white, 0.08),
    }}
  >
    <Typography>{name}</Typography>
    {icon && (
      <WalletIcon
        icon={icon}
        name={name}
        sx={{ backgroundColor: 'common.white' }}
      />
    )}
  </MenuItem>
);
