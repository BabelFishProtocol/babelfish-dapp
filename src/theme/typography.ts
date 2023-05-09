import { Palette } from '@mui/material/styles';
import createTypography from '@mui/material/styles/createTypography';

export const getTypography = (palette: Palette) =>
  createTypography(palette, {
    fontFamily: ['Comfortaa-Regular', 'Open Sans', 'Montserrat', 'Roboto'].join(
      ','
    ),
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
      fontSize: 30,
    },
    h6: {
      fontSize: 24,
    },
    subtitle1: {
      fontSize: 16,
    },
    subtitle2: {
      fontSize: 14,
      opacity: 0.6,
    },
    button: {
      fontFamily: 'Archive',
      lineHeight: 'normal',
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
  });
