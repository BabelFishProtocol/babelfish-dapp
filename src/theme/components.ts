import { alpha, Components, Palette, Theme } from '@mui/material/styles';

import ComfortaaWoff2 from '../assets/fonts/Comfortaa-Regular.woff2';
import ComfortaaWoff from '../assets/fonts/Comfortaa-Regular.woff';
import ArchiveWoff2 from '../assets/fonts/Archive-Regular.woff2';
import ArchiveWoff from '../assets/fonts/Archive-Regular.woff';

import { colors } from './palette';

const transition = `250ms cubic-bezier(0.4, 0, 0.2, 1)`;

export const getComponents = (palette: Palette): Components<Theme> => ({
  MuiCssBaseline: {
    styleOverrides: `
    *::-webkit-scrollbar {
      width: 8px;
      border-radius: 10px;
    }
    *::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: #4f4f4f;
    }
    *::-webkit-scrollbar-track {
      border-radius: 10px;
      background: rgba(255,255,255,0.5);
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.6);
    }
    @font-face {
      font-family: Comfortaa-Regular;
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
        padding: '16px 24px',
        border: 0,
        ':hover': {
          border: 0,
        },
      },
      contained: { borderRadius: '12px' },
      containedPrimary: {
        backgroundImage: `linear-gradient(to left, ${palette.primary.light}, ${palette.primary.main})`,
        transition: `opacity ${transition}`,
        ':hover': {
          opacity: 0.8,
        },
        '&.Mui-disabled': {
          backgroundImage: `linear-gradient(to left, ${alpha(
            palette.primary.light,
            0.6
          )} , ${alpha(palette.primary.light, 0.6)} )`,
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
      textSizeSmall: { textTransform: 'unset', padding: 0 },
      outlinedSizeSmall: {
        padding: '8px 12px',
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: '50%',
        background: palette.grey[800],
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
        '&.Mui-error': {
          borderWidth: 1,
        },
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
        fontSize: 14,
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
  MuiPaper: {
    styleOverrides: {
      outlined: {
        background: 'none',
      },
    },
    defaultProps: {
      square: true,
      variant: 'outlined',
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      grouped: {
        ':last-of-type, :not(:last-of-type)': {
          borderRadius: '12px',
          borderColor: palette.borderGrey.main,
        },
        ':not(:last-of-type).Mui-selected, :last-of-type.Mui-selected': {
          borderColor: palette.primary.main,
        },
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        fontFamily: 'Comfortaa-Regular',
        fontWeight: 'bold',
        borderRadius: '8px !important', // !important needed to override all borderRadius from subclasses
        border: `1px solid ${palette.borderGrey.main} !important`, // !important needed to override all border properties from subclasses
        '&.Mui-selected': {
          border: `1px solid ${alpha(palette.primary.main, 1)} !important`, // !important needed to override all border properties from subclasses
        },
        '&.Mui-disabled': {
          background: 'none',
        },
      },
      sizeSmall: {
        padding: '5px 0',
        fontFamily: 'Comfortaa-Regular',
        fontSize: '12px',
        flexGrow: 1,
        gap: '5px',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        backgroundImage: palette.boxGradient,
        minHeight: '500px',
        width: '500px',
        maxWidth: '800px',
        borderRadius: '8px',
        border: 'none',
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        width: '100%',
        fontFamily: 'Archive',
        borderBottom: `1px solid ${palette.borderGrey.main}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '30px',
        paddingTop: '30px !important',
      },
    },
  },
});
