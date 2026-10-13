// ==============================|| OVERRIDES - TOOLTIP ||============================== //

export default function Tooltip(theme) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: theme.palette.background.paper,
          ...theme.applyStyles('dark', {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.grey[600],
            border: `1px solid ${theme.palette.grey[500]}`
          })
        },
        arrow: theme.applyStyles('dark', { color: theme.palette.grey[600] })
      }
    }
  };
}
