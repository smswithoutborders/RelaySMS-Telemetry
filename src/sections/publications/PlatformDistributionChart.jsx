import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';

// components
import Loader from 'components/Loader';

export default function PlatformDistributionChart({ filters }) {
  const theme = useTheme();

  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0];

  const startDate = filters?.startDate || '2021-01-10';
  const endDate = filters?.endDate || defaultEndDate;
  const status = filters?.status || '';
  const source = filters?.source || '';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
    theme.palette.primary[700]
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;

        const params = {
          start_date: startDate,
          end_date: endDate,
          group_by: 'platform',
          page: 1,
          page_size: 100
        };

        if (status) params.status = status;
        if (source) params.source = source;

        const response = await axios.get(`${baseUrl}publications`, { params });

        const publications = response?.data?.publications?.data ?? [];

        // Group by platform and count
        const platformCounts = publications.reduce((acc, item) => {
          const platform = item.platform_name || 'Unknown';
          acc[platform] = (acc[platform] || 0) + 1;
          return acc;
        }, {});

        // Convert to chart data format
        const chartData = Object.entries(platformCounts).map(([platform, count], index) => ({
          id: index,
          value: count,
          label: platform
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching platform distribution data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, status, source]);

  return (
    <>
      {loading ? (
        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size={50} fullScreen={false} />
        </Box>
      ) : (
        <Box sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Platform Distribution
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Publications by Platform
          </Typography>

          {data.length > 0 ? (
            <PieChart
              series={[
                {
                  data: data,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' }
                }
              ]}
              colors={colors}
              height={300}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'bottom', horizontal: 'middle' },
                  padding: 0,
                  itemMarkWidth: 10,
                  itemMarkHeight: 10,
                  markGap: 5,
                  itemGap: 10,
                  labelStyle: {
                    fontSize: 12,
                    fill: theme.palette.text.primary
                  }
                }
              }}
            />
          ) : (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No data available</Typography>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

PlatformDistributionChart.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    status: PropTypes.string,
    source: PropTypes.string
  })
};
