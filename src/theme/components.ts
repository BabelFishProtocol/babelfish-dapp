import { alpha, Components, Palette, Theme } from '@mui/material/styles';

import ComfortaaWoff2 from '../assets/fonts/Comfortaa-Regular.woff2';
import ComfortaaWoff from '../assets/fonts/Comfortaa-Regular.woff';
import ArchiveWoff2 from '../assets/fonts/Archive-Regular.woff2';
import ArchiveWoff from '../assets/fonts/Archive-Regular.woff';

import { colors } from './palette';

// Base styles were taken from https://unpkg.com/tailwindcss@3.3.2/src/css/preflight.css
const sovrynOnboardOverrides = `
[data-layout-id="dapp-onboard"] *, [role="tooltip"] {
  font-family: Roboto, sans-serif;
}

[data-layout-id="dapp-onboard"] *:not(div),
::before,
::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
}

[data-layout-id^="dapp-onboard--back"], [data-layout-id^="dapp-onboard-back"] {
  color: #f5f5f5;
  background-color: transparent;
}

[data-layout-id="dapp-onboard"] li > button {
  background-color: transparent;
}

[data-layout-id^="dapp-onboard--back"] svg, [data-layout-id^="dapp-onboard-back"] svg {
  transform: rotate(180deg);
}

[data-layout-id="dapp-onboard"] hr {
  height: 0; 
  color: inherit; 
  border-top-width: 1px; 
}

[data-layout-id="dapp-onboard"] abbr:where([title]) {
  text-decoration: underline dotted;
}
  
[data-layout-id="dapp-onboard"] a {
  color: inherit;
  text-decoration: inherit;
}

[data-layout-id="dapp-onboard"] strong {
  font-weight: bolder;
}

[data-layout-id="dapp-onboard"] code,
kbd,
samp,
pre {
  font-family: Roboto Mono, monospace; 
  font-size: 1em; 
}

[data-layout-id="dapp-onboard"] small {  
  font-size: 80%;
}

[data-layout-id="dapp-onboard"] sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

[data-layout-id="dapp-onboard"] sub {
  bottom: -0.25em;
}

[data-layout-id="dapp-onboard"] sup {
  top: -0.5em;
}

[data-layout-id="dapp-onboard"] table {
  text-indent: 0; 
  border-color: inherit; 
  border-collapse: collapse; 
}

[data-layout-id="dapp-onboard--addresslist"] + div button:not([data-layout-id="dapp-onboard--addresslist-confirm"]) {
  font-family: inherit; 
  font-weight: inherit; 
  color: inherit; 
  background-color: transparent;
}

[data-layout-id="dapp-onboard"] button,
select {
  text-transform: none;
}

[data-layout-id="dapp-onboard"] button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button;
  background-image: none;
}

[data-layout-id="dapp-onboard-close"] {
  background-color: transparent;
}

[data-layout-id="dapp-onboard"] :-moz-focusring {
  outline: auto;
}

[data-layout-id="dapp-onboard"] :-moz-ui-invalid {
  box-shadow: none;
}

[data-layout-id="dapp-onboard"] progress {
  vertical-align: baseline;
}

[data-layout-id="dapp-onboard"] ::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

[data-layout-id="dapp-onboard"] [type='search'] {
  -webkit-appearance: textfield; 
  outline-offset: -2px;
}

[data-layout-id="dapp-onboard"] ::-webkit-search-decoration {
  -webkit-appearance: none;
}

[data-layout-id="dapp-onboard"] ::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}

[data-layout-id="dapp-onboard"] summary {
  display: list-item;
}

[data-layout-id="dapp-onboard"] blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

[data-layout-id="dapp-onboard"] fieldset {
  margin: 0;
  padding: 0;
}

[data-layout-id="dapp-onboard"] legend {
  padding: 0;
}

[data-layout-id="dapp-onboard"] ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

[data-layout-id="dapp-onboard"] textarea {
  resize: vertical;
}

[data-layout-id="dapp-onboard"] input::placeholder,
textarea::placeholder {
  opacity: 1; 
  color: #9ca3af; 
}

[data-layout-id="dapp-onboard"] button,
[role="button"] {
  cursor: pointer;
}

[data-layout-id="dapp-onboard"] :disabled {
  cursor: default;
}

[data-layout-id="dapp-onboard"] img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; 
  vertical-align: middle; 
}

[data-layout-id="dapp-onboard"] img,
video {
  max-width: 100%;
  height: auto;
}

[data-layout-id="dapp-onboard"] [hidden] {
  display: none;
}
`;

const transition = `250ms cubic-bezier(0.4, 0, 0.2, 1)`;

export const getComponents = (palette: Palette): Components<Theme> => ({
  MuiCssBaseline: {
    styleOverrides: `
    body {
      overflow: overlay;
    }
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

    ${sovrynOnboardOverrides}
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
        borderRadius: 8,
        '&.MuiButton-outlinedSuccess': {
          boxShadow: `inset 0 0 0 2px ${palette.success.main}`,
          backgroundColor: palette.success.light,
          color: 'white',
          ':hover': {
            backgroundColor: palette.success.main,
          },
        },
        '&.MuiButton-outlinedError': {
          boxShadow: `inset 0 0 0 2px ${palette.error.main}`,
          backgroundColor: palette.error.light,
          color: 'white',
          ':hover': {
            backgroundColor: palette.error.main,
          },
        },
      },
      outlinedPrimary: {
        boxShadow: `inset 0 0 0 2px ${palette.primary.main}`,
      },
      text: {
        fontSize: 14,
        padding: 5,
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
      root: { borderRadius: '50%' },
    },
  },
  MuiTable: {
    styleOverrides: {
      root: {
        borderCollapse: 'separate',
        borderSpacing: 0,
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

        '&:first-of-type': {
          borderBottomLeftRadius: 8,
          borderTopLeftRadius: 8,
        },
        '&:last-of-type': {
          borderBottomRightRadius: 8,
          borderTopRightRadius: 8,
        },
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
        '& .MuiSelect-icon': {
          color: palette.primary.main,
          fontSize: '2rem',
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
        minHeight: 500,
        width: 500,
        maxWidth: 800,
        borderRadius: 8,
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
        padding: 30,
        paddingTop: '30px !important',
      },
    },
  },
});
