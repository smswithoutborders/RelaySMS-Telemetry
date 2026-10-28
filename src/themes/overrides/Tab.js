// material-ui
import { alpha } from '@mui/material/styles';

// ==============================|| OVERRIDES - TAB ||============================== //

export default function Tab(theme) {
  return {
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 46,
          color: theme.palette.text.primary,
          borderRadius: 8,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.lighter, 0.6),
            color: theme.palette.primary.main
          },
          '&:focus-visible': {
            borderRadius: 8,
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: -3
          }
        }
      }
    }
  };
}
