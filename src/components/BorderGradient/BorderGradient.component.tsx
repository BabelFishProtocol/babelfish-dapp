import Box from '@mui/material/Box';
import React from 'react';
import { BorderGradientProps } from './BorderGradient.types';

export const BorderGradient: React.FC<BorderGradientProps> = ({
  borderWidth = 1,
  borderGradient,
  children,
}) => (
  <Box
    sx={({ palette }) => ({
      position: 'relative',
      border: `${borderWidth}px solid transparent`,
      borderRadius: 2,
      backgroundColor: palette.background.default,
      backgroundClip: 'padding-box',
      ':after': {
        content: '""',
        position: 'absolute',
        top: -1 * borderWidth,
        right: -1 * borderWidth,
        bottom: -1 * borderWidth,
        left: -1 * borderWidth,
        borderRadius: 'inherit',
        backgroundImage:
          borderGradient ||
          `linear-gradient(45deg, #2a303c, ${palette.primary.light} 60%, ${palette.primary.main})`,
        zIndex: -1,
      },
    })}
  >
    {children}
  </Box>
);
