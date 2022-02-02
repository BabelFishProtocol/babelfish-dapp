import React from 'react'
import { createTheme, responsiveFontSizes, ThemeProvider as MuiThemeProvider, Theme, Components } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';
import createPalette from '@mui/material/styles/createPalette'

/* @ts-ignore */
import Comfortaa from '../assets/fonts/Comfortaa-Regular.ttf';
/* @ts-ignore */
import Heavitas from '../assets/fonts/Heavitas.ttf';

const palette = createPalette({
  mode: 'dark',
  primary: {
    main: "#ffbf42"
  },
  background: {
    default: "#181a20",
  }
})

const components: Components<Theme> = {
  MuiCssBaseline: {
    styleOverrides: `
      @font-face {
        font-family: 'Comfortaa-Regular';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: url(${Comfortaa}) format('truetype');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }
      @font-face {
        font-family: 'Heavitas';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: url(${Heavitas}) format('truetype');
        unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
      }
    `,
  },
}

const theme = responsiveFontSizes(
  createTheme({
    palette,
    components,
    typography: {
      fontSize: 14,
      fontFamily: [
        'Heavitas',
      ].join(',')
    },
  })
)

export const ThemeProvider: React.FC = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
)
