import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
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
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';

// components
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';

dayjs.extend(utc);
dayjs.extend(isoWeek);

export default function UserRetentionMetrics({ filters }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [cohortData, setCohortData] = useState([]);
  const [retentionCurves, setRetentionCurves] = useState([]);
  const [view, setView] = useState('cohort');
  const [periodType, setPeriodType] = useState('month');

  const today = new Date().toISOString().split('T')[0];
  const startDate = filters?.startDate || '2021-01-10';
  const endDate = filters?.endDate || today;
  const country = filters?.countryCode || '';
  const type = filters?.type || '';
  const origin = filters?.origin || '';

  const calculateFuturePeriod = useCallback((basePeriod, periodsAhead) => {
    const date = dayjs(basePeriod);
    return date.add(periodsAhead, 'month').format('YYYY-MM-DD');
  }, []);

  const processCohortData = useCallback(
    (signupData, retainedData) => {
      const retainedMap = retainedData.reduce((acc, item) => {
        acc[item.timeframe] = item.retained_users || 0;
        return acc;
      }, {});

      const cohorts = signupData.map((signup, index) => {
        const signupPeriod = signup.timeframe;
        const signupCount = signup.signup_users || 0;

        const retentionPeriods = [];

        retentionPeriods.push({
          period: 0,
          users: signupCount,
          percentage: 100
        });

        for (let i = 1; i <= 6; i++) {
          const futurePeriod = calculateFuturePeriod(signupPeriod, i);
          const retainedUsers = retainedMap[futurePeriod] || 0;
          const retentionPercentage = signupCount > 0 ? ((retainedUsers / signupCount) * 100).toFixed(1) : 0;

          retentionPeriods.push({
            period: i,
            users: retainedUsers,
            percentage: parseFloat(retentionPercentage)
          });
        }

        return {
          cohort: signupPeriod,
          signupCount,
          retentionPeriods
        };
      });

      return cohorts.slice(0, 12);
    },
    [calculateFuturePeriod]
  );

  const formatCohortName = useCallback((dateStr) => {
    return dayjs(dateStr).format('MMM YYYY');
  }, []);

  const processRetentionCurves = useCallback(
    (cohorts) => {
      return cohorts.map((cohort) => ({
        cohortName: formatCohortName(cohort.cohort),
        data: cohort.retentionPeriods.map((period) => period.percentage)
      }));
    },
    [formatCohortName]
  );

  useEffect(() => {
    const fetchRetentionData = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;
        const countryParam = country ? `&country_code=${country}` : '';
        const typeParam = type ? `&type=${type}` : '';
        const originParam = origin ? `&origin=${origin}` : '';

        const signupResponse = await axios.get(
          `${baseUrl}signup?category=signup&start_date=${startDate}&end_date=${endDate}&granularity=month&group_by=date&page=1&page_size=100${countryParam}${typeParam}${originParam}`
        );

        const retainedResponse = await axios.get(
          `${baseUrl}retained?category=retained&start_date=${startDate}&end_date=${endDate}&granularity=month&group_by=date&page=1&page_size=100${countryParam}${typeParam}${originParam}`
        );

        const signupData = signupResponse?.data?.signup?.data ?? [];
        const retainedData = retainedResponse?.data?.retained?.data ?? [];

        const cohorts = processCohortData(signupData, retainedData);
        setCohortData(cohorts);

        const curves = processRetentionCurves(cohorts);
        setRetentionCurves(curves);
      } catch (err) {
        console.error('Error fetching retention data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRetentionData();
  }, [startDate, endDate, country, type, origin, processCohortData, processRetentionCurves]);

  const getCellColor = (percentage) => {
    if (percentage >= 80) return theme.palette.success.dark;
    if (percentage >= 60) return theme.palette.success.main;
    if (percentage >= 40) return theme.palette.warning.main;
    if (percentage >= 20) return theme.palette.warning.light;
    return theme.palette.error.light;
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
              User Retention Analysis (Monthly Cohorts)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track how well you retain users over time with monthly cohort analysis
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
              <ToggleButton value="cohort">Cohort Table</ToggleButton>
              <ToggleButton value="curve">Retention Curves</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Key Metrics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          {cohortData.length > 0 && (
            <>
              <Box
                sx={{
                  flex: '1 1 200px',
                  p: 2,
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Average Day 1 Retention
                </Typography>
                <Typography variant="h4">
                  {(cohortData.reduce((sum, cohort) => sum + (cohort.retentionPeriods[1]?.percentage || 0), 0) / cohortData.length).toFixed(
                    1
                  )}
                  %
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: '1 1 200px',
                  p: 2,
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Average Month 3 Retention
                </Typography>
                <Typography variant="h4">
                  {(cohortData.reduce((sum, cohort) => sum + (cohort.retentionPeriods[3]?.percentage || 0), 0) / cohortData.length).toFixed(
                    1
                  )}
                  %
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: '1 1 200px',
                  p: 2,
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Average Month 6 Retention
                </Typography>
                <Typography variant="h4">
                  {(cohortData.reduce((sum, cohort) => sum + (cohort.retentionPeriods[6]?.percentage || 0), 0) / cohortData.length).toFixed(
                    1
                  )}
                  %
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {cohortData.length === 0 ? (
        <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">No retention data available for the selected period</Typography>
        </Box>
      ) : view === 'cohort' ? (
        // Cohort Table View
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Cohort</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    Users
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Period 0
                  </TableCell>
                  {[1, 2, 3, 4, 5, 6].map((period) => (
                    <TableCell key={period} align="center" sx={{ fontWeight: 'bold' }}>
                      +{period}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {cohortData.map((cohort) => (
                  <TableRow key={cohort.cohort} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{formatCohortName(cohort.cohort)}</TableCell>
                    <TableCell align="right">{cohort.signupCount.toLocaleString()}</TableCell>
                    {cohort.retentionPeriods.map((period, idx) => (
                      <TableCell
                        key={idx}
                        align="center"
                        sx={{
                          backgroundColor: `${getCellColor(period.percentage)}20`,
                          fontWeight: 500,
                          color: getCellColor(period.percentage)
                        }}
                      >
                        {period.percentage}%
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              * Period 0 = Signup month, +1 = Next month, +2 = Two months later, etc.
            </Typography>
          </Box>
        </Box>
      ) : (
        // Retention Curves View
        <Box sx={{ width: '100%', height: 400 }}>
          <LineChart
            xAxis={[
              {
                data: [0, 1, 2, 3, 4, 5, 6],
                label: 'Months Since Signup',
                scaleType: 'linear',
                tickLabelStyle: {
                  fontSize: 12,
                  fill: theme.palette.text.primary
                }
              }
            ]}
            yAxis={[
              {
                label: 'Retention Rate (%)',
                min: 0,
                max: 100,
                tickLabelStyle: {
                  fontSize: 12,
                  fill: theme.palette.text.primary
                }
              }
            ]}
            series={retentionCurves.slice(0, 6).map((curve, idx) => ({
              data: curve.data,
              label: curve.cohortName,
              curve: 'monotoneX',
              showMark: true
            }))}
            margin={{ top: 20, bottom: 60, left: 60, right: 20 }}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 0,
                itemMarkWidth: 15,
                itemMarkHeight: 2,
                markGap: 5,
                itemGap: 10,
                labelStyle: {
                  fontSize: 11,
                  fill: theme.palette.text.primary
                }
              }
            }}
          />
        </Box>
      )}
    </MainCard>
  );
}

UserRetentionMetrics.propTypes = {
  filters: PropTypes.object
};
