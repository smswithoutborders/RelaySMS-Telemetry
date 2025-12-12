import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// components
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import { height } from '@mui/system';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function UsageHeatmap({ filters }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState([]);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const startDate = filters?.startDate || '2020-01-10';
  const endDate = filters?.endDate || today;
  const platform = filters?.platform || '';
  const status = filters?.status || '';
  const source = filters?.source || '';
  const country = filters?.country || '';

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hoursOfDay = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      setLoading(true);
      setError('');
      try {
        const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;

        const params = {
          start_date: startDate,
          end_date: endDate,
          page: 1,
          page_size: 100
        };

        if (platform) params.platform_name = platform;
        if (status) params.status = status;
        if (source) params.source = source;
        if (country) params.country_code = country;

        // Fetch all pages
        const firstResponse = await axios.get(`${baseUrl}publications`, { params });
        const totalPages = firstResponse?.data?.publications?.pagination?.total_pages || 1;

        let allPublications = firstResponse?.data?.publications?.data ?? [];

        if (totalPages > 1) {
          const pagePromises = [];
          for (let page = 2; page <= totalPages; page++) {
            pagePromises.push(axios.get(`${baseUrl}publications`, { params: { ...params, page } }));
          }

          const responses = await Promise.all(pagePromises);
          responses.forEach((response) => {
            const pageData = response?.data?.publications?.data ?? [];
            allPublications = [...allPublications, ...pageData];
          });
        }

        const matrix = Array(7)
          .fill(null)
          .map(() => Array(24).fill(0));

        allPublications.forEach((pub) => {
          if (pub.date_created) {
            const date = dayjs(pub.date_created);
            const dayOfWeek = date.day(); // 0 = Sunday
            const hour = date.hour();
            matrix[dayOfWeek][hour]++;
          }
        });

        const maxValue = Math.max(...matrix.flat());

        const formattedData = [];
        for (let day = 0; day < 7; day++) {
          for (let hour = 0; hour < 24; hour++) {
            formattedData.push({
              day,
              hour,
              count: matrix[day][hour],
              intensity: maxValue > 0 ? matrix[day][hour] / maxValue : 0
            });
          }
        }

        setHeatmapData(formattedData);
      } catch (err) {
        console.error('Error fetching heatmap data:', err);
        setError('Failed to load usage heatmap data');
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, [startDate, endDate, platform, status, source, country]);

  const getColor = (intensity) => {
    const isDarkMode = theme.palette.mode === 'dark';

    if (intensity === 0) {
      return isDarkMode ? theme.palette.grey[800] : theme.palette.grey[100];
    }

    if (isDarkMode) {
      if (intensity < 0.2) return theme.palette.primary.darker;
      if (intensity < 0.4) return theme.palette.primary.dark;
      if (intensity < 0.6) return theme.palette.primary.main;
      if (intensity < 0.8) return theme.palette.primary.light;
      return theme.palette.primary.lighter;
    } else {
      if (intensity < 0.2) return theme.palette.primary.lighter;
      if (intensity < 0.4) return theme.palette.primary.light;
      if (intensity < 0.6) return theme.palette.primary.main;
      if (intensity < 0.8) return theme.palette.primary.dark;
      return theme.palette.primary.darker;
    }
  };

  if (loading) {
    return (
      <MainCard>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <Loader size={50} fullScreen={false} />
        </Box>
      </MainCard>
    );
  }

  if (error) {
    return (
      <MainCard>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </MainCard>
    );
  }

  return (
    <MainCard sx={{ height: 446, p: 1 }}>
      <Typography variant="h5" gutterBottom>
        Peak Usage Hours
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Publication activity by day of week and hour of day
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 600 }}>
          {/* Hour labels */}
          <Box sx={{ display: 'flex', mb: 1, ml: 6 }}>
            {hoursOfDay.map((hour) => (
              <Box
                key={hour}
                sx={{
                  width: 28,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'text.secondary'
                }}
              >
                {hour}
              </Box>
            ))}
          </Box>

          {/* Heatmap grid */}
          {daysOfWeek.map((day, dayIndex) => (
            <Box key={day} sx={{ display: 'flex', mb: 0.5, alignItems: 'center' }}>
              {/* Day label */}
              <Box
                sx={{
                  width: 40,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  pr: 1,
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                {day}
              </Box>

              {/* Hour cells */}
              {hoursOfDay.map((hour) => {
                const dataPoint = heatmapData.find((d) => d.day === dayIndex && d.hour === hour);
                const count = dataPoint?.count || 0;
                const intensity = dataPoint?.intensity || 0;

                return (
                  <Box
                    key={`${dayIndex}-${hour}`}
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: getColor(intensity),
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
                      borderRadius: 0.5,
                      mr: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.2)',
                        zIndex: 10,
                        boxShadow: theme.shadows[4],
                        '& .count-tooltip': {
                          display: 'block'
                        }
                      },
                      position: 'relative'
                    }}
                    title={`${day} ${hour}:00 - ${count} publications`}
                  >
                    <Box
                      className="count-tooltip"
                      sx={{
                        display: 'none',
                        position: 'absolute',
                        top: -30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: 1,
                        fontSize: '11px',
                        whiteSpace: 'nowrap',
                        zIndex: 1000
                      }}
                    >
                      {count}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ))}

          {/* Legend */}
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ mr: 2 }}>
              Less
            </Typography>
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: getColor(intensity),
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
                  borderRadius: 0.5,
                  mr: 0.5
                }}
              />
            ))}
            <Typography variant="caption" sx={{ ml: 1 }}>
              More
            </Typography>
          </Box>
        </Box>
      </Box>
    </MainCard>
  );
}

UsageHeatmap.propTypes = {
  filters: PropTypes.object
};
