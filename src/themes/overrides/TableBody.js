// ==============================|| OVERRIDES - TABLE ROW ||============================== //

export default function TableBody(theme) {
  const isDarkMode = theme.palette.mode === 'dark';

  const hoverStyle = {
    '&:hover': {
      backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.secondary.lighter
    }
  };

  return {
    MuiTableBody: {
      styleOverrides: {
        root: {
          '&.striped .MuiTableRow-root': {
            '&:nth-of-type(even)': {
              backgroundColor: isDarkMode ? theme.palette.background.default : theme.palette.grey[50]
            },
            ...hoverStyle
          },
          '& .MuiTableRow-root': {
            ...hoverStyle
          }
        }
      }
    }
  };
}
