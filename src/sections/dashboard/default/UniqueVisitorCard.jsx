import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import UserAreaChart from './UserAreaChart';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard({ filters }) {
  const [view, setView] = useState('month'); // 'month' or 'day'

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Button
              size="small"
              onClick={() => setView('month')}
              color={view === 'month' ? 'primary' : 'secondary'}
              variant={view === 'month' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setView('day')}
              color={view === 'day' ? 'primary' : 'secondary'}
              variant={view === 'day' ? 'outlined' : 'text'}
            >
              Day
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <UserAreaChart view={view} filters={filters} />
        </Box>
      </MainCard>
    </>
  );
}
