import React from 'react';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { getPalette } from './palette';
import { getTypography } from './typography';
import { getComponents } from './components';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    borderGrey: Palette['primary'];
    boxGradient: string;
  }
  interface PaletteOptions {
    borderGrey: PaletteOptions['primary'];
    boxGradient: string;
  }
}

const palette = getPalette();
const typography = getTypography(palette);
const components = getComponents(palette);

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
