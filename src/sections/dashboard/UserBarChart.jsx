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
import { Button } from 'antd';
import { BarChart } from '@mui/x-charts/BarChart';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

// components
import Loader from 'components/Loader';

export default function UserBarChart({ view, filters }) {
  const theme = useTheme();

  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0];

  const startDate = filters?.startDate || '2020-01-10';
  const endDate = filters?.endDate || defaultEndDate;
  const [labels, setLabels] = useState([]);
  const [signupData, setSignupData] = useState([]);
  const [retainedData, setRetainedData] = useState([]);
  const [showSignups, setShowSignups] = useState(true);
  const [showRetained, setShowRetained] = useState(true);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const granularity = view === 'month' ? 'month' : 'day';

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.info.main;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;
        const countryParam = filters?.countryCode ? `&country_code=${filters.countryCode}` : '';

        const signupResponse = await axios.get(
          `${baseUrl}signup?category=signup&start_date=${startDate}&end_date=${endDate}&granularity=${granularity}&group_by=date&page=${currentPage + 1}&page_size=${pageSize}${countryParam}`
        );

        const retainedResponse = await axios.get(
          `${baseUrl}retained?category=retained&start_date=${startDate}&end_date=${endDate}&granularity=${granularity}&group_by=date&page=${currentPage + 1}&page_size=${pageSize}${countryParam}`
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, granularity, currentPage, filters?.countryCode]);

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      {loading ? (
        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size={50} fullScreen={false} />
        </Box>
      ) : (
        <>
          <Box sx={{ p: 2.5, pb: 0 }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  User Data
                </Typography>
                <Typography variant="h5">Signups & Retained</Typography>
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
                ...(showRetained ? [{ data: retainedData, label: 'Retained', color: secondaryColor, type: 'bar' }] : [])
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

          <Stack direction="row" sx={{ justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button size="small" type="text" disabled={currentPage + 1 >= totalPages} onClick={() => handlePageChange(currentPage + 1)}>
              <LeftOutlined /> <Typography variant="body2">Previous</Typography>
            </Button>
            <Typography variant="body2" color="text.primary">
              Page {currentPage + 1}
            </Typography>

            <Button size="small" type="text" disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}>
              <Typography variant="body2">Next</Typography> <RightOutlined />
            </Button>
          </Stack>
        </>
      )}
    </>
  );
}

UserBarChart.propTypes = {
  view: PropTypes.oneOf(['month', 'day']),
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    countryCode: PropTypes.string
  })
};
