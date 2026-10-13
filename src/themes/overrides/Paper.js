// ==============================|| OVERRIDES - PAPER ||============================== //

export default function Paper(theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: theme.applyStyles('dark', { backgroundImage: 'none' })
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: theme.applyStyles('dark', { border: `1px solid ${theme.palette.divider}` })
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: theme.applyStyles('dark', { border: `1px solid ${theme.palette.divider}` })
      }
    }
  };
}
