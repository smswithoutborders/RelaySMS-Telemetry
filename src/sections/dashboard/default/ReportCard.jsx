import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import UserBarChart from 'sections/dashboard/UserBarChart';

// sales report status
const status = [
  {
    value: 'day',
    label: 'Day'
  },
  {
    value: 'month',
    label: 'Month'
  }
];

export default function ReportCard() {
  const [value, setValue] = useState('month');

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <TextField
            id="standard-select-currency"
            size="small"
            select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <UserBarChart view={value === 'month' ? 'month' : 'day'} />
    </>
  );
}
