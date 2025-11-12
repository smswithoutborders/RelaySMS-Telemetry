import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from 'antd';
import { BarChart } from '@mui/x-charts/BarChart';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

// components
import Loader from 'components/Loader';

export default function PublicationChart({ filters }) {
  const theme = useTheme();

  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0];

  const startDate = filters?.startDate || '2021-01-10';
  const endDate = filters?.endDate || defaultEndDate;
  const platform = filters?.platform || '';
  const status = filters?.status || '';
  const source = filters?.source || '';

  const [labels, setLabels] = useState([]);
  const [publishedData, setPublishedData] = useState([]);
  const [failedData, setFailedData] = useState([]);
  const [showPublished, setShowPublished] = useState(true);
  const [showFailed, setShowFailed] = useState(true);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const primaryColor = theme.palette.success.main;
  const errorColor = theme.palette.error.main;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;

        const params = {
          start_date: startDate,
          end_date: endDate,
          granularity: 'day',
          group_by: 'date',
          page: currentPage + 1,
          page_size: pageSize
        };

        if (platform) params.platform_name = platform;
        if (source) params.source = source;

        // Fetch published data
        const publishedParams = { ...params, status: 'published' };
        const publishedResponse = await axios.get(`${baseUrl}publications`, { params: publishedParams });

        // Fetch failed data
        const failedParams = { ...params, status: 'failed' };
        const failedResponse = await axios.get(`${baseUrl}publications`, { params: failedParams });

        const published = publishedResponse?.data?.publications?.data ?? [];
        const failed = failedResponse?.data?.publications?.data ?? [];

        // Group published data by date
        const publishedByDate = published.reduce((acc, item) => {
          const date = item.date_created?.split('T')[0] || item.date_created;
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Group failed data by date
        const failedByDate = failed.reduce((acc, item) => {
          const date = item.date_created?.split('T')[0] || item.date_created;
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Get all unique dates and sort them
        const allLabels = [...new Set([...Object.keys(publishedByDate), ...Object.keys(failedByDate)])].sort();
        setLabels(allLabels);

        // Map the counts to labels
        setPublishedData(allLabels.map((label) => publishedByDate[label] || 0));
        setFailedData(allLabels.map((label) => failedByDate[label] || 0));

        setTotalPages(publishedResponse?.data?.publications?.pagination?.total_pages || 1);
      } catch (error) {
        console.error('Error fetching publication chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, platform, status, source, currentPage]);

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const series = [];
  if (showPublished) {
    series.push({
      data: publishedData,
      label: 'Published',
      id: 'Published',
      color: primaryColor
    });
  }
  if (showFailed) {
    series.push({
      data: failedData,
      label: 'Failed',
      id: 'Failed',
      color: errorColor
    });
  }

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
                  Publication Data
                </Typography>
                <Typography variant="h5">Publications Over Time</Typography>
              </Box>

              <FormGroup>
                <Stack direction="row">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showPublished}
                        onChange={(e) => setShowPublished(e.target.checked)}
                        sx={{
                          color: primaryColor,
                          '&.Mui-checked': { color: primaryColor }
                        }}
                      />
                    }
                    label="Published"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showFailed}
                        onChange={(e) => setShowFailed(e.target.checked)}
                        sx={{
                          color: errorColor,
                          '&.Mui-checked': { color: errorColor }
                        }}
                      />
                    }
                    label="Failed"
                  />
                </Stack>
              </FormGroup>
            </Stack>
          </Box>

          <Box sx={{ pt: 1, pr: 2 }}>
            <BarChart
              height={340}
              series={series}
              xAxis={[
                {
                  scaleType: 'band',
                  data: labels,
                  tickLabelStyle: axisFontStyle
                }
              ]}
              yAxis={[{ tickLabelStyle: axisFontStyle }]}
              margin={{ left: 50, right: 10, top: 20, bottom: 50 }}
              slotProps={{
                legend: { hidden: true }
              }}
              sx={{
                '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': { stroke: theme.palette.divider }
              }}
            />
          </Box>

          <Stack direction="row" spacing={1} sx={{ px: 2.5, pb: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Button type="text" icon={<LeftOutlined />} disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)} />
            <Typography variant="body2" color="text.primary">
              Page {currentPage + 1} of {totalPages}
            </Typography>
            <Button
              type="text"
              icon={<RightOutlined />}
              disabled={currentPage >= totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Stack>
        </>
      )}
    </>
  );
}

PublicationChart.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    platform: PropTypes.string,
    status: PropTypes.string,
    source: PropTypes.string
  })
};
