import { Palette } from '@mui/material/styles';
import createTypography from '@mui/material/styles/createTypography';

export const getTypography = (palette: Palette) =>
  createTypography(palette, {
    h1: {
      fontSize: 30,
      fontFamily: 'Archive',
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Archive',
    },
    h3: {
      fontSize: 20,
      fontFamily: 'Archive',
    },
    h4: {
      fontSize: 16,
      fontFamily: 'Archive',
    },
    h5: {
      fontFamily: 'Comfortaa-Regular',
      fontSize: 30,
    },
    h6: {
      fontFamily: 'Comfortaa-Regular',
      fontSize: 24,
    },
    subtitle1: {
      fontSize: 16,
    },
    button: {
      fontFamily: 'Archive',
      lineHeight: 'normal',
    },
    body1: {
      fontFamily: 'Comfortaa-Regular',
      fontSize: 16,
    },
    body2: {
      fontFamily: 'Comfortaa-Regular',
      fontSize: 14,
    },
    caption: {
      fontFamily: 'Comfortaa-Regular',
      fontSize: 12,
    },
  });
