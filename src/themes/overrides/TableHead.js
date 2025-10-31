// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableHead(theme) {
  const isDarkMode = theme.palette.mode === 'dark';

  return {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: isDarkMode ? theme.palette.grey[900] : theme.palette.grey[50],
          borderTop: '1px solid',
          borderTopColor: theme.palette.divider,
          borderBottom: '2px solid',
          borderBottomColor: theme.palette.divider
        }
      }
    }
  };
}
