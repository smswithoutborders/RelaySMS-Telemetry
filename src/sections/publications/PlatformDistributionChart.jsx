import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
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

  const startDate = filters?.startDate || '2020-01-10';
  const endDate = filters?.endDate || defaultEndDate;
  const status = filters?.status || '';
  const source = filters?.source || '';
  const country = filters?.country || '';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedItem, setHighlightedItem] = useState(null);

  // Platform-specific brand colors
  const getPlatformColor = useCallback(
    (platformName) => {
      const platform = platformName.toLowerCase();
      switch (platform) {
        case 'gmail':
          return '#34A853'; // Gmail green
        case 'twitter':
        case 'x':
          return '#242424ff'; // X/Twitter black
        case 'telegram':
          return '#0088CC'; // Telegram blue
        case 'bluesky':
          return '#1185FE'; // Bluesky blue
        case 'mastodon':
          return '#6364FF'; // Mastodon purple
        case 'slack':
          return '#4A154B'; // Slack purple
        case 'email_bridge':
          return '#FFA726'; // Orange for email bridge
        default:
          return theme.palette.primary.main; // Fallback to theme primary
      }
    },
    [theme.palette.primary.main]
  );

  const handleLegendClick = (event, legendItem) => {
    const clickedIndex = data.findIndex((item) => item.label === legendItem.label);
    if (clickedIndex !== -1) {
      setHighlightedItem(highlightedItem === clickedIndex ? null : clickedIndex);
    }
  };

  const handleItemClick = (event, itemData) => {
    setHighlightedItem(highlightedItem === itemData.dataIndex ? null : itemData.dataIndex);
  };

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

        const platformCounts = allPublications.reduce((acc, item) => {
          const platform = item.platform_name || 'Unknown';
          acc[platform] = (acc[platform] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(platformCounts).map(([platform, count], index) => ({
          id: index,
          value: count,
          label: platform,
          color: getPlatformColor(platform)
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching platform distribution data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, status, source, country, getPlatformColor]);

  return (
    <>
      {loading ? (
        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size={30} fullScreen={false} />
        </Box>
      ) : (
        <Box sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Publications by Platform
          </Typography>

          {data.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                '& .MuiPieArc-root': {
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  transition: 'all 0.3s ease',
                  opacity: (theme) => (highlightedItem !== null ? 0.3 : 1)
                },
                [`& .MuiPieArc-root:nth-of-type(${highlightedItem !== null ? highlightedItem + 1 : 0})`]: {
                  filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.25))',
                  transform: 'scale(1.05)',
                  opacity: 1
                },
                '& .MuiPieArc-root:hover': {
                  filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.25))',
                  transform: 'scale(1.05)',
                  opacity: '1 !important'
                }
              }}
            >
              <PieChart
                series={[
                  {
                    data: data,
                    innerRadius: 60,
                    outerRadius: 120,
                    paddingAngle: 2,
                    cornerRadius: 8,
                    cx: 150,
                    cy: 130
                  }
                ]}
                colors={data.map((item) => item.color)}
                height={370}
                margin={{ top: 10, bottom: 80, left: 10, right: 10 }}
                onItemClick={handleItemClick}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                    itemMarkWidth: 20,
                    itemMarkHeight: 12,
                    markGap: 6,
                    itemGap: 12,
                    labelStyle: {
                      fontSize: 12,
                      fill: theme.palette.text.primary,
                      fontWeight: 500
                    },
                    onItemClick: handleLegendClick
                  }
                }}
                sx={{
                  '& .MuiChartsLegend-series text': {
                    fontSize: '12px !important'
                  },
                  '& .MuiChartsLegend-mark': {
                    borderRadius: '3px !important',
                    rx: 3
                  },
                  '& .MuiChartsLegend-series': {
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }
                }}
              />
            </Box>
          ) : (
            <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
    source: PropTypes.string,
    country: PropTypes.string
  })
};
