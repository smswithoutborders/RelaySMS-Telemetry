import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid2';
import { Button } from 'antd';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// project imports
import MainCard from 'components/MainCard';
import UserAreaChart from './UserAreaChart';
import UserBarChart from 'sections/dashboard/UserBarChart';

// ==============================|| COMBINED CHART CARD ||============================== //

export default function CombinedChartCard({ filters }) {
  const [view, setView] = useState('month');
  const [chartType, setChartType] = useState('area');

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              style={{ fontSize: '0.7rem' }}
              size="small"
              onClick={() => setView('month')}
              color={view === 'month' ? 'primary' : 'secondary'}
              variant={view === 'month' ? 'dashed' : 'text'}
            >
              Month
            </Button>
            <Button
              style={{ fontSize: '0.7rem' }}
              size="small"
              onClick={() => setView('day')}
              color={view === 'day' ? 'primary' : 'secondary'}
              variant={view === 'day' ? 'dashed' : 'text'}
            >
              Day
            </Button>
          </Stack>
        </Grid>
        <Grid>
          <ToggleButtonGroup value={chartType} exclusive onChange={handleChartTypeChange} size="small" color="primary">
            <ToggleButton value="bar" aria-label="bar chart">
              Bar Chart
            </ToggleButton>
            <ToggleButton value="area" aria-label="area chart">
              Area Chart
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      <Box content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ py: 2, pr: 2 }}>
          {chartType === 'area' ? <UserAreaChart view={view} filters={filters} /> : <UserBarChart view={view} filters={filters} />}
        </Box>
      </Box>
    </>
  );
}

CombinedChartCard.propTypes = {
  filters: PropTypes.object
};
