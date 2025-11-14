import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
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
  const country = filters?.country || '';

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
          page: currentPage + 1,
          page_size: 100
        };

        if (platform) params.platform_name = platform;
        if (source) params.source = source;
        if (country) params.country_code = country;

        const response = await axios.get(`${baseUrl}publications`, { params });

        const allPublications = response?.data?.publications?.data ?? [];

        const dataByDate = {};

        allPublications.forEach((item) => {
          const date = item.date_created?.split('T')[0] || item.date_created;
          const itemStatus = item.status?.toLowerCase();

          if (!dataByDate[date]) {
            dataByDate[date] = { published: 0, failed: 0 };
          }

          if (itemStatus === 'published') {
            dataByDate[date].published += 1;
          } else if (itemStatus === 'failed') {
            dataByDate[date].failed += 1;
          }
        });

        const allLabels = Object.keys(dataByDate).sort();
        setLabels(allLabels);

        setPublishedData(allLabels.map((label) => dataByDate[label]?.published || 0));
        setFailedData(allLabels.map((label) => dataByDate[label]?.failed || 0));

        setTotalPages(response?.data?.publications?.pagination?.total_pages || 1);
      } catch (error) {
        console.error('Error fetching publication chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, platform, source, country, currentPage]);

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
                <Typography variant="h6">Publications Over Time</Typography>
              </Box>

              <FormGroup>
                <Stack direction="row">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showPublished}
                        onChange={() => setShowPublished(!showPublished)}
                        sx={{ '&.Mui-checked': { color: primaryColor }, '&:hover': { backgroundColor: alpha(primaryColor, 0.08) } }}
                      />
                    }
                    label="Published"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={showFailed}
                        onChange={() => setShowFailed(!showFailed)}
                        sx={{ '&.Mui-checked': { color: errorColor }, '&:hover': { backgroundColor: alpha(errorColor, 0.08) } }}
                      />
                    }
                    label="Failed"
                  />
                </Stack>
              </FormGroup>
            </Stack>

            <BarChart
              height={450}
              grid={{ horizontal: true }}
              xAxis={[
                {
                  data: labels,
                  scaleType: 'band',
                  tickLabelStyle: {
                    ...axisFontStyle,
                    fontSize: 11,
                    fontWeight: 500
                  }
                }
              ]}
              yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle }]}
              series={[
                ...(showPublished ? [{ data: publishedData, label: 'Published', color: primaryColor, type: 'bar' }] : []),
                ...(showFailed ? [{ data: failedData, label: 'Failed', color: errorColor, type: 'bar' }] : [])
              ]}
              slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
              axisHighlight={{ x: 'none' }}
              margin={{ top: 30, left: 40, right: 10, bottom: 60 }}
              tooltip={{
                trigger: 'item'
              }}
              slots={{
                itemContent: (props) => {
                  const { itemData, series } = props;
                  const date = labels[itemData.dataIndex];
                  const count = itemData.value ?? series.data[itemData.dataIndex];
                  return (
                    <Box
                      sx={{
                        bgcolor: 'background.paper',
                        p: 1.5,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        boxShadow: 2
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {date}
                      </Typography>
                      <Typography variant="body2" sx={{ color: series.color }}>
                        {series.label}: {count}
                      </Typography>
                    </Box>
                  );
                }
              }}
              sx={{
                '& .MuiBarElement-root:hover': { opacity: 0.6 },
                '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': { stroke: theme.palette.divider }
              }}
            />
          </Box>

          <Stack direction="row" sx={{ justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button size="small" type="text" disabled={currentPage >= totalPages - 1} onClick={() => handlePageChange(currentPage + 1)}>
              <LeftOutlined /> <Typography variant="body2">Previous</Typography>
            </Button>
            <Typography variant="body2" color="text.primary">
              Page {currentPage + 1}
            </Typography>
            <Button size="small" type="text" disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}>
              <Typography variant="body2">Next</Typography>
              <RightOutlined />
            </Button>
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
    source: PropTypes.string,
    country: PropTypes.string
  })
};
