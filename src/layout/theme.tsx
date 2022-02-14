import React from 'react';
import {
  alpha,
  Theme,
  Components,
  createTheme,
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createPalette from '@mui/material/styles/createPalette';
import createTypography from '@mui/material/styles/createTypography';

import ComfortaaWoff2 from '../assets/fonts/Comfortaa-Regular.woff2';
import ComfortaaWoff from '../assets/fonts/Comfortaa-Regular.woff';
import ArchiveWoff2 from '../assets/fonts/Archive-Regular.woff2';
import ArchiveWoff from '../assets/fonts/Archive-Regular.woff';

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

const colors = {
  primary: '#ffbf42',
  black: '#0c0b10',
  lightYellow: '#fddc90',
  borderGrey: 'rgba(255, 255, 255, 0.2)',
  borderGreyDark: 'rgba(255, 255, 255, 0.1)',
};

const transition = `250ms cubic-bezier(0.4, 0, 0.2, 1)`;

const palette = createPalette({
  mode: 'dark',
  primary: {
    main: colors.primary,
    light: colors.lightYellow,
  },
  background: {
    default: '#181a20',
    paper: '#272626',
  },
  success: {
    main: '#32f05f',
  },
  error: {
    main: '#ef0512',
  },
  borderGrey: {
    main: colors.borderGrey,
    dark: colors.borderGreyDark,
  },
  boxGradient: `linear-gradient(243deg, #ffc148 0%, #5e5544 0%, #383838 25%, #212020 80%)`,
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
        fontSize: 18,
        padding: '16px 54px',
        border: 0,
        ':hover': {
          border: 0,
        },
      },
      containedPrimary: {
        borderRadius: '12px',
        backgroundImage: `linear-gradient(to left, ${palette.primary.light}, ${palette.primary.main})`,
        transition: `opacity ${transition}`,
        ':hover': {
          opacity: 0.8,
        },
      },
      outlined: {
        borderRadius: '8px',
      },
      outlinedPrimary: {
        boxShadow: `inset 0 0 0 2px ${palette.primary.main}`,
      },
      text: {
        fontSize: 14,
        padding: '5px',
        ':hover': {
          textDecoration: 'underline',
        },
      },
      outlinedSizeSmall: {
        padding: '8px 12px',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        position: 'relative',
        border: '1px solid transparent',
        borderRadius: 8,
        backgroundImage: palette.boxGradient,
        backgroundClip: 'padding-box',
        ':after': {
          content: '""',
          position: 'absolute',
          top: -1,
          right: -1,
          bottom: -1,
          left: -1,
          borderRadius: 'inherit',
          backgroundImage: `linear-gradient(45deg, #2a303c, ${palette.primary.light} 30%, ${palette.primary.main}, ${palette.primary.light} 70% , #2a303c)`,
          backgroundPosition: '0% 100%',
          backgroundSize: '200% 200%',
          transition: `background-position ${transition}`,
          zIndex: -1,
        },
        ':hover': {
          ':after': {
            backgroundPosition: '100% 0%',
          },
        },
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        fontFamily: 'Archive',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        fontFamily: 'inherit',
        border: 'none',
        padding: 10,
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        borderTop: `1px solid ${palette.borderGrey.main}`,
      },
    },
  },
  MuiContainer: {
    styleOverrides: {
      root: {
        backgroundImage: palette.boxGradient,
        borderRadius: 8,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiSelect: {
    defaultProps: {
      MenuProps: {
        PaperProps: {
          square: true,
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        background: palette.background.default,
        maxWidth: 'unset',
      },
      arrow: {
        color: palette.background.default,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      list: {
        padding: 0,
        backgroundColor: colors.black,
      },
      paper: {
        borderRadius: 0,
        border: `1px solid ${palette.primary.dark}`,
      },
      root: {},
    },
    defaultProps: {
      PaperProps: {
        square: true,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        padding: '10px 18px',
        '&.Mui-selected': {
          backgroundColor: alpha(palette.primary.main, 0.1),
        },
        ':hover': {
          backgroundColor: alpha(palette.primary.main, 0.1),
        },
        ':focus': {
          backgroundColor: alpha(palette.primary.main, 0.2),
        },
      },
    },
  },
};

const typography = createTypography(palette, {
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
    marginBottom: '12px',
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
