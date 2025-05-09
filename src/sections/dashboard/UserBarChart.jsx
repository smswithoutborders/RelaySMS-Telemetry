import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { BarChart } from '@mui/x-charts/BarChart';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

// project imports
import MainCard from 'components/MainCard';

export default function UserBarChart({ view, startDate: propStartDate, endDate: propEndDate }) {
  const theme = useTheme();

  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(propStartDate || '2020-01-10');
  const [endDate, setEndDate] = useState(propEndDate || defaultEndDate);
  const [labels, setLabels] = useState([]);
  const [signupData, setSignupData] = useState([]);
  const [retainedData, setRetainedData] = useState([]);
  const [showSignups, setShowSignups] = useState(true);
  const [showRetained, setShowRetained] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const granularity = view === 'month' ? 'month' : 'day';

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.primary[700];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;

        const signupResponse = await axios.get(
          `${baseUrl}signup?category=signup&start_date=${startDate}&end_date=${endDate}&granularity=${granularity}&group_by=date&page=${currentPage + 1}&page_size=${pageSize}`
        );

        const retainedResponse = await axios.get(
          `${baseUrl}retained?category=retained&start_date=${startDate}&end_date=${endDate}&granularity=${granularity}&group_by=date&page=${currentPage + 1}&page_size=${pageSize}`
        );

        const signup = signupResponse?.data?.signup?.data ?? [];
        const retained = retainedResponse?.data?.retained?.data ?? [];

        const allLabels = [...new Set([...signup.map((d) => d.timeframe), ...retained.map((d) => d.timeframe)])].sort();
        setLabels(allLabels);

        const mapData = (data, label) => {
          const item = data.find((d) => d.timeframe === label);
          return item ? item.signup_users || item.retained_users : 0;
        };

        setSignupData(allLabels.map((label) => mapData(signup, label)));
        setRetainedData(allLabels.map((label) => mapData(retained, label)));

        setTotalPages(signupResponse?.data?.signup?.pagination?.total_pages || 1);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate, granularity, currentPage]);

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <MainCard sx={{ mt: 1 }} content={false}>
        <Box sx={{ p: 2.5, pb: 0 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                User Data
              </Typography>
              <Typography variant="h4">Signups & Retained</Typography>
            </Box>

            <FormGroup>
              <Stack direction="row">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showSignups}
                      onChange={() => setShowSignups(!showSignups)}
                      sx={{ '&.Mui-checked': { color: primaryColor }, '&:hover': { backgroundColor: alpha(primaryColor, 0.08) } }}
                    />
                  }
                  label="Signups"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showRetained}
                      onChange={() => setShowRetained(!showRetained)}
                      sx={{ '&.Mui-checked': { color: secondaryColor } }}
                    />
                  }
                  label="Retained"
                />
              </Stack>
            </FormGroup>
          </Stack>

          <BarChart
            height={400}
            grid={{ horizontal: true }}
            xAxis={[{ data: labels, scaleType: 'band', tickLabelStyle: { ...axisFontStyle, fontSize: 12 } }]}
            yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle }]}
            series={[
              ...(showSignups ? [{ data: signupData, label: 'Signups', color: primaryColor, type: 'bar' }] : []),
              ...(showRetained ? [{ data: retainedData, label: 'Retained', color: '#ff9e43', type: 'bar' }] : [])
            ]}
            slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
            axisHighlight={{ x: 'none' }}
            margin={{ top: 30, left: 40, right: 10 }}
            tooltip={{ trigger: 'item' }}
            sx={{
              '& .MuiBarElement-root:hover': { opacity: 0.6 },
              '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': { stroke: theme.palette.divider }
            }}
          />
        </Box>
      </MainCard>

      {/* Pagination Buttons */}
      <Stack direction="row" sx={{ justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button size="small" variant="contained" disabled={currentPage + 1 >= totalPages} onClick={() => handlePageChange(currentPage + 1)}>
          <LeftOutlined /> Previous
        </Button>
        <Typography variant="body2" color="text.primary">
          Page {currentPage + 1}
        </Typography>

        <Button size="small" variant="contained" disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}>
          Next <RightOutlined />
        </Button>
      </Stack>
    </>
  );
}

UserBarChart.propTypes = {
  view: PropTypes.oneOf(['month', 'day']),
  startDate: PropTypes.string,
  endDate: PropTypes.string
};
