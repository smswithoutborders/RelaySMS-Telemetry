import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts/LineChart';
import { WarningOutlined } from '@ant-design/icons';
import { CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { RiseOutlined } from '@ant-design/icons';
import { FallOutlined } from '@ant-design/icons';

// components
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';

dayjs.extend(utc);

export default function ShutdownEarlyWarning({ filters }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [countryTimelines, setCountryTimelines] = useState([]);
  const [view, setView] = useState('alerts');

  const today = new Date().toISOString().split('T')[0];
  const startDate = filters?.startDate || dayjs().subtract(30, 'day').format('YYYY-MM-DD');
  const endDate = filters?.endDate || today;
  const countryFilter = filters?.countryCode || '';
  const typeFilter = filters?.type || '';
  const originFilter = filters?.origin || '';

  const baselineStartDate = dayjs(startDate).subtract(7, 'day').format('YYYY-MM-DD');
  const baselineEndDate = dayjs(startDate).subtract(1, 'day').format('YYYY-MM-DD');

  const fetchSignupData = useCallback(async (start, end, country = '', type = '', origin = '') => {
    const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;
    const countryParam = country ? `&country_code=${country}` : '';
    const typeParam = type ? `&type=${type}` : '';
    const originParam = origin ? `&origin=${origin}` : '';

    const response = await axios.get(
      `${baseUrl}signup?category=signup&start_date=${start}&end_date=${end}&granularity=day&group_by=country&page=1&page_size=100${countryParam}${typeParam}${originParam}`
    );

    return response?.data?.signup?.data ?? [];
  }, []);

  const fetchRetainedData = useCallback(async (start, end, country = '', type = '', origin = '') => {
    const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;
    const countryParam = country ? `&country_code=${country}` : '';
    const typeParam = type ? `&type=${type}` : '';
    const originParam = origin ? `&origin=${origin}` : '';

    const response = await axios.get(
      `${baseUrl}retained?category=retained&start_date=${start}&end_date=${end}&granularity=day&group_by=country&page=1&page_size=100${countryParam}${typeParam}${originParam}`
    );

    return response?.data?.retained?.data ?? [];
  }, []);

  const calculateRetentionRate = useCallback((signups, retained, country) => {
    const countrySignups = signups.filter((s) => s.country_code === country);
    const countryRetained = retained.filter((r) => r.country_code === country);

    const totalSignups = countrySignups.reduce((sum, s) => sum + (s.signup_users || 0), 0);
    const totalRetained = countryRetained.reduce((sum, r) => sum + (r.retained_users || 0), 0);

    if (totalSignups === 0) return 0;
    return ((totalRetained / totalSignups) * 100).toFixed(1);
  }, []);

  const detectAnomalies = useCallback(
    (baselineData, currentData, retainedData) => {
      const anomalies = [];

      const currentByCountry = currentData.reduce((acc, item) => {
        const country = item.country_code;
        if (!acc[country]) {
          acc[country] = { signups: 0, countryName: item.country_name };
        }
        acc[country].signups += item.signup_users || 0;
        return acc;
      }, {});

      const baselineByCountry = baselineData.reduce((acc, item) => {
        const country = item.country_code;
        if (!acc[country]) {
          acc[country] = { signups: 0 };
        }
        acc[country].signups += item.signup_users || 0;
        return acc;
      }, {});

      Object.entries(currentByCountry).forEach(([country, data]) => {
        const currentSignups = data.signups;
        const baselineSignups = baselineByCountry[country]?.signups || 0;

        let percentageChange = 0;
        if (baselineSignups > 0) {
          percentageChange = ((currentSignups - baselineSignups) / baselineSignups) * 100;
        } else if (currentSignups > 0) {
          percentageChange = 100;
        }

        if (percentageChange > 200 || (currentSignups - baselineSignups > 50 && percentageChange > 100)) {
          const retentionRate = parseFloat(calculateRetentionRate(currentData, retainedData, country));

          let alertType = 'info';
          let alertLevel = 'Low';
          let message = '';
          let confidence = 0;

          if (retentionRate >= 50) {
            alertType = 'warning';
            alertLevel = retentionRate >= 70 ? 'High' : 'Medium';
            message = 'Possible shutdown preparation - Users actively using service';
            confidence = Math.min(95, 50 + retentionRate / 2);
          } else if (retentionRate < 50 && retentionRate > 0) {
            alertType = 'info';
            alertLevel = 'Low';
            message = 'Moderate retention - Monitor for confirmation';
            confidence = 30 + retentionRate;
          } else {
            alertType = 'error';
            alertLevel = 'Critical';
            message = 'Possible spam/bot attack - Low retention rate';
            confidence = 75;
          }

          anomalies.push({
            country,
            countryName: data.countryName || country,
            currentSignups,
            baselineSignups,
            percentageChange: percentageChange.toFixed(1),
            retentionRate,
            alertType,
            alertLevel,
            message,
            confidence: confidence.toFixed(0),
            detectedAt: new Date().toISOString()
          });
        }
      });

      return anomalies.sort((a, b) => {
        const severityOrder = { High: 3, Medium: 2, Low: 1, Critical: 4 };
        if (severityOrder[a.alertLevel] !== severityOrder[b.alertLevel]) {
          return severityOrder[b.alertLevel] - severityOrder[a.alertLevel];
        }
        return b.percentageChange - a.percentageChange;
      });
    },
    [calculateRetentionRate]
  );

  const processTimelineData = useCallback((data) => {
    const grouped = data.reduce((acc, item) => {
      const country = item.country_code;
      const date = item.timeframe;

      if (!acc[country]) {
        acc[country] = {
          countryName: item.country_name || country,
          data: []
        };
      }

      acc[country].data.push({
        date,
        signups: item.signup_users || 0
      });

      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([country, info]) => ({
        country,
        countryName: info.countryName,
        totalSignups: info.data.reduce((sum, d) => sum + d.signups, 0),
        timeline: info.data.sort((a, b) => new Date(a.date) - new Date(b.date))
      }))
      .sort((a, b) => b.totalSignups - a.totalSignups)
      .slice(0, 10);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baselineSignups = await fetchSignupData(baselineStartDate, baselineEndDate, countryFilter, typeFilter, originFilter);

        const currentSignups = await fetchSignupData(startDate, endDate, countryFilter, typeFilter, originFilter);

        const retainedUsers = await fetchRetainedData(startDate, endDate, countryFilter, typeFilter, originFilter);

        const detectedAnomalies = detectAnomalies(baselineSignups, currentSignups, retainedUsers);
        setAlerts(detectedAnomalies);

        const allData = [...baselineSignups, ...currentSignups];
        const timelines = processTimelineData(allData);
        setCountryTimelines(timelines);
      } catch (err) {
        console.error('Error fetching shutdown warning data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    startDate,
    endDate,
    countryFilter,
    typeFilter,
    originFilter,
    baselineStartDate,
    baselineEndDate,
    fetchSignupData,
    fetchRetainedData,
    detectAnomalies,
    processTimelineData
  ]);

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'warning':
        return <WarningOutlined sx={{ color: theme.palette.warning.main }} />;
      case 'error':
        return <ErrorOutlined sx={{ color: theme.palette.error.main }} />;
      case 'info':
        return <CheckCircleOutlined sx={{ color: theme.palette.info.main }} />;
      default:
        return <CheckCircleOutlined sx={{ color: theme.palette.success.main }} />;
    }
  };

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.success.main;
    }
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
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

  return (
    <MainCard>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              Internet Shutdown Early Warning System
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitors signup spikes and retention patterns to detect potential shutdowns or spam attacks
            </Typography>
          </Box>

          <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
            <ToggleButton value="alerts">Alert Dashboard</ToggleButton>
            <ToggleButton value="timeline">Country Timelines</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Summary Metrics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MainCard>
              <Typography variant="caption" color="text.secondary">
                Critical Alerts
              </Typography>
              <Typography variant="h4" color="error.main">
                {alerts.filter((a) => a.alertLevel === 'Critical').length}
              </Typography>
              <Typography variant="caption">Possible spam attacks</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MainCard>
              <Typography variant="caption" color="text.secondary">
                High Risk Alerts
              </Typography>
              <Typography variant="h4" color="warning.dark">
                {alerts.filter((a) => a.alertLevel === 'High').length}
              </Typography>
              <Typography variant="caption">Likely shutdown prep</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MainCard>
              <Typography variant="caption" color="text.secondary">
                Medium Risk Alerts
              </Typography>
              <Typography variant="h4" color="info.dark">
                {alerts.filter((a) => a.alertLevel === 'Medium').length}
              </Typography>
              <Typography variant="caption">Monitor closely</Typography>
            </MainCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MainCard>
              <Typography variant="caption" color="text.secondary">
                Total Countries Monitored
              </Typography>
              <Typography variant="h4" color="success.dark">
                {countryTimelines.length}
              </Typography>
              <Typography variant="caption">Active countries</Typography>
            </MainCard>
          </Grid>
        </Grid>
      </Box>

      {alerts.length === 0 && view === 'alerts' ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <CheckCircleOutlined sx={{ fontSize: 64, color: theme.palette.success.main, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Anomalies Detected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All signup patterns appear normal. The system is monitoring for unusual activity.
          </Typography>
        </Box>
      ) : view === 'alerts' ? (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Active Alerts ({alerts.length})
          </Typography>
          <Grid container spacing={2}>
            {alerts.map((alert, index) => (
              <Grid item xs={12} key={index}>
                <Alert
                  severity={alert.alertType}
                  icon={getAlertIcon(alert.alertType)}
                  sx={{
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <strong>
                      {alert.countryName} ({alert.country})
                    </strong>
                    <Chip
                      label={alert.alertLevel}
                      size="small"
                      sx={{
                        bgcolor: getAlertColor(alert.alertType),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    <Chip label={`${alert.confidence}% Confidence`} size="small" variant="outlined" />
                  </AlertTitle>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {alert.message}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Current Signups
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="h6">{alert.currentSignups}</Typography>
                        <RiseOutlined sx={{ color: theme.palette.error.main, fontSize: 20 }} />
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Baseline (7-day avg)
                      </Typography>
                      <Typography variant="h6">{alert.baselineSignups}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Change
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        +{alert.percentageChange}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Retention Rate
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: alert.retentionRate >= 50 ? theme.palette.success.main : theme.palette.error.main
                        }}
                      >
                        {alert.retentionRate}%
                      </Typography>
                    </Box>
                  </Box>
                </Alert>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        // Timeline View
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Signup Trends by Country (Top 10)
          </Typography>
          {countryTimelines.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="body2" color="text.secondary">
                No timeline data available for the selected period
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {countryTimelines.slice(0, 6).map((countryData, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: theme.palette.divider,
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {countryData.countryName} ({countryData.country})
                    </Typography>
                    <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                      Total Signups: {countryData.totalSignups.toLocaleString()}
                    </Typography>
                    <Box sx={{ height: 200, mt: 2 }}>
                      <LineChart
                        xAxis={[
                          {
                            data: countryData.timeline.map((_, idx) => idx),
                            scaleType: 'point',
                            tickLabelStyle: {
                              fontSize: 10,
                              fill: theme.palette.text.primary
                            }
                          }
                        ]}
                        yAxis={[
                          {
                            tickLabelStyle: {
                              fontSize: 10,
                              fill: theme.palette.text.primary
                            }
                          }
                        ]}
                        series={[
                          {
                            data: countryData.timeline.map((t) => t.signups),
                            curve: 'monotoneX',
                            showMark: true,
                            color: theme.palette.primary.main
                          }
                        ]}
                        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                        grid={{ horizontal: true }}
                      />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </MainCard>
  );
}

ShutdownEarlyWarning.propTypes = {
  filters: PropTypes.object
};
