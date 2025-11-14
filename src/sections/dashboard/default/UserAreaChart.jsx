import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from 'antd';

import { LineChart } from '@mui/x-charts/LineChart';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { fontSize } from '@mui/system';

// components
import Loader from 'components/Loader';

function Legend({ items, onToggle }) {
  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', mt: 2.5, mb: 1.5 }}>
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
          onClick={() => onToggle(item.label)}
        >
          <Box sx={{ width: 12, height: 12, bgcolor: item.visible ? item.color : 'grey.500', borderRadius: '50%' }} />
          <Typography variant="body2" color="text.primary">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function UserAreaChart({ view, filters }) {
  const theme = useTheme();

  const [labels, setLabels] = useState([]);
  const [signupData, setSignupData] = useState([]);
  const [retainedData, setRetainedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibility, setVisibility] = useState({
    Signups: true,
    Retained: true
  });
  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0];

  const startDate = filters?.startDate || '2020-01-10';
  const endDate = filters?.endDate || defaultEndDate;

  const granularity = view === 'month' ? 'month' : 'day';

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

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
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, granularity, currentPage, filters?.countryCode]);

  const toggleVisibility = (label) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleSeries = [
    {
      data: signupData,
      label: 'Signups',
      showMark: false,
      area: true,
      id: 'Signups',
      color: theme.palette.primary.main,
      visible: visibility['Signups']
    },
    {
      data: retainedData,
      label: 'Retained',
      showMark: false,
      area: true,
      id: 'Retained',
      color: theme.palette.primary[700],
      visible: visibility['Retained']
    }
  ];

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      {loading ? (
        <Box sx={{ height: 428, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size={50} fullScreen={false} />
        </Box>
      ) : (
        <>
          <Legend items={visibleSeries} onToggle={toggleVisibility} />
          <LineChart
            grid={{ horizontal: true }}
            xAxis={[{ scaleType: 'point', data: labels, disableLine: true, tickLabelStyle: axisFontStyle }]}
            yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle }]}
            height={428}
            margin={{ top: 40, bottom: 20, right: 20 }}
            series={visibleSeries
              .filter((series) => series.visible)
              .map((series) => ({
                type: 'line',
                data: series.data,
                label: series.label,
                showMark: series.showMark,
                area: series.area,
                id: series.id,
                color: series.color,
                stroke: series.color,
                strokeWidth: 2
              }))}
            slotProps={{ legend: { hidden: true } }}
            sx={{
              '& .MuiAreaElement-series-Signups': { fill: "url('#myGradient1')", strokeWidth: 2, opacity: 0.8 },
              '& .MuiAreaElement-series-Retained': { fill: "url('#myGradient2')", strokeWidth: 2, opacity: 0.8 },
              '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: theme.palette.divider }
            }}
          >
            <defs>
              <linearGradient id="myGradient1" gradientTransform="rotate(90)">
                <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.4)} />
                <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
              </linearGradient>
              <linearGradient id="myGradient2" gradientTransform="rotate(90)">
                <stop offset="10%" stopColor={alpha(theme.palette.primary[700], 0.4)} />
                <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
              </linearGradient>
            </defs>
          </LineChart>

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

Legend.propTypes = { items: PropTypes.array, onToggle: PropTypes.func };

UserAreaChart.propTypes = {
  view: PropTypes.oneOf(['month', 'day']),
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    countryCode: PropTypes.string
  })
};
