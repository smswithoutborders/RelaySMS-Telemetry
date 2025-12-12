import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';

// components
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';

const fetchPlatformData = async (startDate, endDate, source, country) => {
  const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;

  const params = {
    start_date: startDate,
    end_date: endDate,
    page: 1,
    page_size: 100
  };

  if (source) params.source = source;
  if (country) params.country_code = country;

  const firstResponse = await axios.get(`${baseUrl}publications`, { params });
  const totalPages = firstResponse?.data?.publications?.pagination?.total_pages || 1;

  let allPublications = firstResponse?.data?.publications?.data ?? [];

  if (totalPages > 1) {
    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        axios.get(`${baseUrl}publications`, {
          params: { ...params, page }
        })
      );
    }

    const responses = await Promise.all(pagePromises);
    responses.forEach((response) => {
      const pageData = response?.data?.publications?.data ?? [];
      allPublications = [...allPublications, ...pageData];
    });
  }

  const platformStats = allPublications.reduce((acc, item) => {
    const platform = item.platform_name || 'Unknown';
    const status = item.status?.toLowerCase();

    if (!acc[platform]) {
      acc[platform] = {
        total: 0,
        successful: 0,
        failed: 0
      };
    }

    acc[platform].total++;
    if (status === 'published') {
      acc[platform].successful++;
    } else if (status === 'failed') {
      acc[platform].failed++;
    }

    return acc;
  }, {});

  const chartData = Object.entries(platformStats)
    .map(([platform, stats]) => ({
      platform,
      successRate: stats.total > 0 ? parseFloat(((stats.successful / stats.total) * 100).toFixed(2)) : 0,
      total: stats.total,
      successful: stats.successful,
      failed: stats.failed
      //   color: getPlatformColor(platform)
    }))
    .sort((a, b) => b.successRate - a.successRate);

  return chartData;
};

export function PlatformSuccessRateSummary({ filters }) {
  const theme = useTheme();
  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0];

  const startDate = filters?.startDate || '2021-01-10';
  const endDate = filters?.endDate || defaultEndDate;
  const source = filters?.source || '';
  const country = filters?.country || '';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const chartData = await fetchPlatformData(startDate, endDate, source, country);
        setData(chartData);
      } catch (error) {
        console.error('Error fetching platform success rate data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, source, country]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <Loader size={40} fullScreen={false} />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {data.map((platform) => (
        <Box
          key={platform.platform}
          sx={{
            flex: '1 1 200px',
            p: 2,
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {/* <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: platform.color,
                mr: 1
              }}
            /> */}
            <Typography variant="subtitle2" fontWeight="bold">
              {platform.platform.toUpperCase()}
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            {platform.successRate}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {platform.successful.toLocaleString()} / {platform.total.toLocaleString()} successful
          </Typography>
          {platform.failed > 0 && (
            <Typography variant="caption" color="error.main" display="block">
              {platform.failed.toLocaleString()} failed
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

PlatformSuccessRateSummary.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    source: PropTypes.string,
    country: PropTypes.string
  })
};

export default function PlatformSuccessRateChart({ filters }) {
  const theme = useTheme();

  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0];

  const startDate = filters?.startDate || '2021-01-10';
  const endDate = filters?.endDate || defaultEndDate;
  const source = filters?.source || '';
  const country = filters?.country || '';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const chartData = await fetchPlatformData(startDate, endDate, source, country);
        setData(chartData);
      } catch (error) {
        console.error('Error fetching platform success rate data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, source, country]);

  return (
    <MainCard>
      {loading ? (
        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size={50} fullScreen={false} />
        </Box>
      ) : (
        <Box sx={{ p: 1.5 }}>
          <Typography variant="h5" gutterBottom>
            Platform Success Rates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Percentage of successful publications by platform (higher is better)
          </Typography>

          {data.length > 0 ? (
            <>
              <Box sx={{ width: '100%', height: 300 }}>
                <BarChart
                  dataset={data}
                  xAxis={[
                    {
                      scaleType: 'band',
                      dataKey: 'platform',
                      tickLabelStyle: {
                        angle: -45,
                        textAnchor: 'end',
                        fontSize: 12,
                        fill: theme.palette.text.primary
                      }
                    }
                  ]}
                  yAxis={[
                    {
                      label: 'Success Rate (%)',
                      min: 0,
                      max: 100,
                      tickLabelStyle: {
                        fontSize: 12,
                        fill: theme.palette.text.primary
                      }
                    }
                  ]}
                  series={[
                    {
                      dataKey: 'successRate',
                      label: 'Success Rate (%)',
                      valueFormatter: (value) => `${value}%`,
                      color: theme.palette.success.main
                    }
                  ]}
                  margin={{ top: 20, bottom: 80, left: 60, right: 20 }}
                  grid={{ horizontal: true }}
                  sx={{
                    '& .MuiBarElement-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }
                  }}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No data available</Typography>
            </Box>
          )}
        </Box>
      )}
    </MainCard>
  );
}

PlatformSuccessRateChart.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    source: PropTypes.string,
    country: PropTypes.string
  })
};
