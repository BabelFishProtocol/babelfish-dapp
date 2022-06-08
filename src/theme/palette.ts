import createPalette from '@mui/material/styles/createPalette';

export const colors = {
  primary: '#ffbf42',
  black: '#0c0b10',
  lightYellow: '#fddc90',
  borderGrey: 'rgba(255, 255, 255, 0.2)',
  borderGreyDark: 'rgba(255, 255, 255, 0.1)',
  darkBlue: '#2C2F3B',
};

export const getPalette = () =>
  createPalette({
    mode: 'dark',
    primary: {
      main: colors.primary,
      light: colors.lightYellow,
    },
    background: {
      default: '#181a20',
      paper: '#798293',
    },
    success: {
      main: '#6FCF97',
      light: 'rgba(145, 255, 191, 0.39)',
    },
    error: {
      main: '#EB5757',
      light: 'rgba(235, 87, 87, 0.39)',
    },
    borderGrey: {
      main: colors.borderGrey,
      dark: colors.borderGreyDark,
    },
    boxGradient: `linear-gradient(243deg, #ffc148 0%, #5e5544 0%, #383838 25%, #212020 80%)`,
  });
