import React from 'react';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
  Theme,
  Components,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createPalette from '@mui/material/styles/createPalette';

/* @ts-ignore */
import ComfortaaWoff2 from '../assets/fonts/Comfortaa-Regular.woff2';
/* @ts-ignore */
import ComfortaaWoff from '../assets/fonts/Comfortaa-Regular.woff';
/* @ts-ignore */
import ArchiveWoff2 from '../assets/fonts/Archive.woff2';
/* @ts-ignore */
import ArchiveWoff from '../assets/fonts/Archive.woff';

const colors = {
  primary: '#ffbf42',
  lightYellow: '#fddc90',
};

const palette = createPalette({
  mode: 'dark',
  primary: {
    main: colors.primary,
  },
  background: {
    default: '#181a20',
  },
});

const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: `
      @font-face {
        font-family: 'Comfortaa-Regular';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: url(${ComfortaaWoff2}) format('woff2'),
             url(${ComfortaaWoff}) format('woff');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }
      @font-face {
        font-family: 'Archive';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: url(${ArchiveWoff2}) format('woff2'),
             url(${ArchiveWoff}) format('woff');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }
    `,
  },
  MuiButton: {
    defaultProps: {
      variant: 'contained',
    },
    styleOverrides: {
      root: {
        padding: '16px 54px 15px 54px',
      },
      containedPrimary: {
        backgroundImage: `linear-gradient(to left, ${colors.lightYellow}, ${colors.primary})`,
      },
    },
  },
};

const typography = {
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
  subtitle1: {
    fontSize: 16,
  },
  button: {
    fontSize: 18,
    fontFamily: 'Archive',
    lineHeight: 1,
  },
};

const theme = responsiveFontSizes(
  createTheme({
    palette,
    components,
    typography,
  })
);

export const ThemeProvider: React.FC = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
);
