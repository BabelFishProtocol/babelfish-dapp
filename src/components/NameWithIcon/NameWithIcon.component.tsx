import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NameWithIconProps } from './NameWithIcon.types';

export const NameWithIcon = ({ name, icon }: NameWithIconProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      maxHeight: 52,
      py: 1.5,
    }}
  >
    <img
      alt={`${name} logo`}
      src={icon}
      height={30}
      width={30}
      style={{
        marginRight: 12,
      }}
    />
    <Typography>{name}</Typography>
  </Box>
);
