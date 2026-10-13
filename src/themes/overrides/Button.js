// material-ui
import { alpha } from '@mui/material/styles';

// project imports
import getColors from 'utils/getColors';
import getShadow from 'utils/getShadow';

function darkTextColors(theme, color) {
  if (color === 'secondary') return { text: theme.palette.grey[300], hover: theme.palette.grey[200] };
  const { light, lighter } = getColors(theme, color);
  return { text: light, hover: lighter };
}

function getColorStyle({ variant, color, theme }) {
  const colors = getColors(theme, color);
  const { lighter, main, dark, darker, contrastText } = colors;
  const darkText = darkTextColors(theme, color);
  const darkTint = alpha(color === 'secondary' ? theme.palette.grey[300] : main, 0.12);

  const buttonShadow = `${color}Button`;
  const shadows = getShadow(theme, buttonShadow);

  const commonShadow = {
    '&::after': {
      boxShadow: `0 0 5px 5px ${alpha(main, 0.9)}`
    },
    '&:active::after': {
      boxShadow: `0 0 0 0 ${alpha(main, 0.9)}`
    },
    '&:focus-visible': {
      outline: `2px solid ${dark}`,
      outlineOffset: 2
    }
  };

  switch (variant) {
    case 'contained':
      return {
        '&:hover': {
          backgroundColor: dark
        },
        ...commonShadow
      };
    case 'shadow':
      return {
        color: contrastText,
        backgroundColor: main,
        boxShadow: shadows,
        '&:hover': {
          boxShadow: 'none',
          backgroundColor: dark
        },
        ...commonShadow
      };
    case 'outlined':
      return {
        borderColor: main,
        '&:hover': {
          color: dark,
          backgroundColor: 'transparent',
          borderColor: dark
        },
        ...theme.applyStyles('dark', {
          color: darkText.text,
          borderColor: darkText.text,
          '&:hover': { color: darkText.hover, backgroundColor: darkTint, borderColor: darkText.hover }
        }),
        ...commonShadow
      };
    case 'dashed':
      return {
        color: main,
        borderColor: main,
        backgroundColor: lighter,
        '&:hover': {
          color: dark,
          borderColor: dark
        },
        ...theme.applyStyles('dark', {
          color: darkText.text,
          borderColor: darkText.text,
          backgroundColor: darkTint,
          '&:hover': { color: darkText.hover, borderColor: darkText.hover }
        }),
        ...commonShadow
      };
    case 'text':
    default:
      return {
        color: dark,
        '&:hover': {
          color: darker,
          backgroundColor: lighter
        },
        ...theme.applyStyles('dark', {
          color: darkText.text,
          '&:hover': { color: darkText.hover, backgroundColor: darkTint }
        }),
        ...commonShadow
      };
  }
}

// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button(theme) {
  const primaryDashed = getColorStyle({ variant: 'dashed', color: 'primary', theme });
  const primaryShadow = getColorStyle({ variant: 'shadow', color: 'primary', theme });

  const disabledFill = theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.08) : theme.palette.grey[200];
  const disabledStyle = {
    backgroundColor: disabledFill,
    '&:hover': {
      backgroundColor: disabledFill
    },
    ...theme.applyStyles('dark', { color: theme.palette.text.disabled })
  };
  const iconStyle = {
    '&>*:nth-of-type(1)': {
      fontSize: 'inherit'
    }
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontWeight: 400,
          '&::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            borderRadius: 4,
            opacity: 0,
            transition: 'all 0.5s'
          },

          '&:active::after': {
            position: 'absolute',
            borderRadius: 4,
            left: 0,
            top: 0,
            opacity: 1,
            transition: '0s'
          }
        },
        contained: {
          '&.Mui-disabled': {
            ...disabledStyle
          }
        },
        outlined: {
          '&.Mui-disabled': {
            ...disabledStyle,
            '&:hover': {
              backgroundColor: disabledFill,
              color: `${theme.palette.grey[300]} !important`,
              borderColor: 'inherit'
            }
          }
        },
        text: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        },
        endIcon: {
          ...iconStyle
        },
        startIcon: {
          ...iconStyle
        },
        dashed: {
          border: '1px dashed',
          ...primaryDashed,
          '&.MuiButton-dashedPrimary': getColorStyle({ variant: 'dashed', color: 'primary', theme }),
          '&.MuiButton-dashedSecondary': getColorStyle({ variant: 'dashed', color: 'secondary', theme }),
          '&.MuiButton-dashedError': getColorStyle({ variant: 'dashed', color: 'error', theme }),
          '&.MuiButton-dashedSuccess': getColorStyle({ variant: 'dashed', color: 'success', theme }),
          '&.MuiButton-dashedInfo': getColorStyle({ variant: 'dashed', color: 'info', theme }),
          '&.MuiButton-dashedWarning': getColorStyle({ variant: 'dashed', color: 'warning', theme }),
          '&.Mui-disabled': {
            color: `${theme.palette.grey[300]} !important`,
            borderColor: `${theme.palette.grey[400]} !important`,
            backgroundColor: `${theme.palette.grey[200]} !important`
          }
        },
        shadow: {
          ...primaryShadow,
          '&.MuiButton-shadowPrimary': getColorStyle({ variant: 'shadow', color: 'primary', theme }),
          '&.MuiButton-shadowSecondary': getColorStyle({ variant: 'shadow', color: 'secondary', theme }),
          '&.MuiButton-shadowError': getColorStyle({ variant: 'shadow', color: 'error', theme }),
          '&.MuiButton-shadowSuccess': getColorStyle({ variant: 'shadow', color: 'success', theme }),
          '&.MuiButton-shadowInfo': getColorStyle({ variant: 'shadow', color: 'info', theme }),
          '&.MuiButton-shadowWarning': getColorStyle({ variant: 'shadow', color: 'warning', theme }),
          '&.Mui-disabled': {
            color: `${theme.palette.grey[300]} !important`,
            borderColor: `${theme.palette.grey[400]} !important`,
            backgroundColor: `${theme.palette.grey[200]} !important`
          }
        },
        containedPrimary: getColorStyle({ variant: 'contained', color: 'primary', theme }),
        containedSecondary: getColorStyle({ variant: 'contained', color: 'secondary', theme }),
        containedError: getColorStyle({ variant: 'contained', color: 'error', theme }),
        containedSuccess: getColorStyle({ variant: 'contained', color: 'success', theme }),
        containedInfo: getColorStyle({ variant: 'contained', color: 'info', theme }),
        containedWarning: getColorStyle({ variant: 'contained', color: 'warning', theme }),
        outlinedPrimary: getColorStyle({ variant: 'outlined', color: 'primary', theme }),
        outlinedSecondary: getColorStyle({ variant: 'outlined', color: 'secondary', theme }),
        outlinedError: getColorStyle({ variant: 'outlined', color: 'error', theme }),
        outlinedSuccess: getColorStyle({ variant: 'outlined', color: 'success', theme }),
        outlinedInfo: getColorStyle({ variant: 'outlined', color: 'info', theme }),
        outlinedWarning: getColorStyle({ variant: 'outlined', color: 'warning', theme }),
        textPrimary: getColorStyle({ variant: 'text', color: 'primary', theme }),
        textSecondary: getColorStyle({ variant: 'text', color: 'secondary', theme }),
        textError: getColorStyle({ variant: 'text', color: 'error', theme }),
        textSuccess: getColorStyle({ variant: 'text', color: 'success', theme }),
        textInfo: getColorStyle({ variant: 'text', color: 'info', theme }),
        textWarning: getColorStyle({ variant: 'text', color: 'warning', theme }),
        sizeExtraSmall: {
          minWidth: 56,
          fontSize: '0.625rem',
          padding: '2px 8px'
        },
        loading: {
          pointerEvents: 'none !important',
          '& svg': {
            width: 'inherit',
            height: 'inherit'
          },
          '&.MuiButton-loadingPositionCenter': {
            color: 'transparent !important'
          }
        }
      }
    }
  };
}
