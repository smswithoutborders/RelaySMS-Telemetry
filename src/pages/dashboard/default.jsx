// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import ReportCard from 'sections/dashboard/default/ReportCard';
import UserTable from 'sections/dashboard/default/UserTable';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { ReloadOutlined } from '@ant-design/icons';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import CountryTable from '../../sections/dashboard/default/CountryTable';

// Helper function to calculate percentage
const maxValues = {
  totalSignupUsers: 50000,
  totalUsers: 30000,
  totalActiveUsers: 20000,
  totalSignupsFromBridges: 10000,
  totalPublications: 15000,
  totalSignupCountries: 200
};

const calculatePercentage = (value, max) => {
  return max ? Math.min((value / max) * 100, 100).toFixed(2) : '0:00';
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [category, setCategory] = useState('signup');
  const [granularity, setGranularity] = useState('day');
  const [groupBy, setGroupBy] = useState('date');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState({});
  const [metrics, setMetrics] = useState({
    totalSignupUsers: 0,
    totalUsers: 0,
    totalActiveUsers: 0,
    totalSignupsFromBridges: 0,
    totalPublications: 0,
    totalSignupCountries: 0,
    percentages: {
      totalSignupUsers: 0,
      totalUsers: 0,
      totalActiveUsers: 0,
      totalSignupsFromBridges: 0,
      totalPublications: 0,
      totalSignupCountries: 0
    }
  });
  const handleApplyFilters = () => {
    const appliedFilters = {
      category,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '2021-01-10',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : today,
      granularity,
      groupBy
    };

    setFiltersApplied(appliedFilters);
  };

  const handleResetFilters = () => {
    const resetStartDate = dayjs('2021-01-01');
    const resetEndDate = dayjs();

    setCategory('signup');
    setGranularity('month');
    setGroupBy('country');
    setStartDate(resetStartDate);
    setEndDate(resetEndDate);

    setFiltersApplied({
      category: 'signup',
      startDate: resetStartDate.format('YYYY-MM-DD'),
      endDate: resetEndDate.format('YYYY-MM-DD'),
      granularity: 'month',
      groupBy: 'country'
    });
  };

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const appliedStart = startDate ? startDate.format('YYYY-MM-DD') : '2021-01-10';
        const appliedEnd = endDate ? endDate.format('YYYY-MM-DD') : today;

        const response = await axios.get(
          `${import.meta.env.VITE_APP_TELEMETRY_API}summary?start_date=${appliedStart}&end_date=${appliedEnd}&granularity=${granularity}&group_by=${groupBy}&page=1&page_size=10`
        );

        const data = response.data.summary;
        const totalUsers = data.total_signup_users + data.total_retained_users + data.total_retained_users_with_tokens;

        setMetrics({
          totalSignupUsers: data.total_signup_users || 0,
          totalUsers: data.total_retained_users || 0,
          totalActiveUsers: data.total_retained_users_with_tokens || 0,
          totalSignupsFromBridges: data.total_signups_from_bridges || 0,
          totalPublications: data.total_publications || 0,
          totalSignupCountries: data.total_signup_countries || 0,
          percentages: {
            totalSignupUsers: calculatePercentage(data.total_signup_users, maxValues.totalSignupUsers),
            totalUsers: calculatePercentage(data.total_retained_users, maxValues.totalUsers),
            totalActiveUsers: calculatePercentage(data.total_retained_users_with_tokens, maxValues.totalActiveUsers),
            totalSignupsFromBridges: calculatePercentage(data.total_signups_from_bridges, maxValues.totalSignupsFromBridges),
            totalPublications: calculatePercentage(data.total_publications, maxValues.totalPublications),
            totalSignupCountries: calculatePercentage(data.total_signup_countries, maxValues.totalSignupCountries)
          }
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to fetch metrics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [filtersApplied]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Open Telemetry</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce
          title="Sign-up Users"
          count={metrics.totalSignupUsers.toLocaleString()}
          // percentage={metrics.percentages.totalSignupUsers}
          extra="Number of Signups"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce
          title="Users"
          count={metrics.totalUsers.toLocaleString()}
          // percentage={metrics.percentages.totalUsers}
          extra="Number of current users"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce
          title="Active Users"
          count={metrics.totalActiveUsers.toLocaleString()}
          // percentage={metrics.percentages.totalActiveUsers}
          extra="Number of users with tokens"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce
          title="Bridge First Users"
          count={metrics.totalSignupsFromBridges.toLocaleString()}
          // percentage={metrics.percentages.totalSignupsFromBridges}
          extra="Number of users via bridges"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce
          title="Publications"
          count={metrics.totalPublications.toLocaleString()}
          // percentage={metrics.percentages.totalPublications}
          extra="Number of messages published"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce
          title="Countries"
          count={metrics.totalSignupCountries.toLocaleString()}
          // percentage={metrics.percentages.totalSignupCountries}
          extra="Available countries with users"
        />
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* Filters Section */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <MainCard sx={{ mt: 1 }} content={false}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Filters
              </Typography>
              <Grid container spacing={2} sx={{ width: '100%' }}>
                {/* Category Filter */}
                <Grid xs={12} md={3} lg={4}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select sx={{ height: '53px' }} value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
                      <MenuItem value="signup">Sign-up Users</MenuItem>
                      <MenuItem value="retained">Users</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Start Date */}
                <Grid xs={12} md={3} lg={2}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                {/* End Date */}
                <Grid xs={12} md={3} lg={2}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                {/* Buttons */}
                <Grid xs={12} md={3} lg={4} container spacing={1}>
                  <Grid xs={6} md={12} lg={6}>
                    <Button sx={{ height: '53px', px: 4 }} fullWidth variant="contained" onClick={handleApplyFilters}>
                      Apply
                    </Button>
                  </Grid>
                  <Grid xs={6} md={12} lg={6}>
                    <Button
                      sx={{ height: '53px', px: 4 }}
                      fullWidth
                      startIcon={<ReloadOutlined />}
                      variant="outlined"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </MainCard>
        </Grid>
      </LocalizationProvider>

      {/* row 2 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard filters={filtersApplied} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <CountryTable filters={filtersApplied} />
      </Grid>
      {/* row 3 */}
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <UserTable filters={filtersApplied} />
      </Grid>

      {/* row 4 */}
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <ReportCard />
      </Grid>
    </Grid>
  );
}
