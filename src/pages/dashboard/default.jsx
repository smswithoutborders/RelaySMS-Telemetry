// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ant design
import { DatePicker, Select, Button, Dropdown } from 'antd';
import 'antd/dist/reset.css';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import CombinedChartCard from 'sections/dashboard/default/CombinedChartCard';
import UserTable from 'sections/dashboard/default/UserTable';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { ReloadOutlined, CalendarOutlined, DownloadOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { getCountryCallingCode } from 'libphonenumber-js';

import CountryTable from '../../sections/dashboard/default/CountryTable';
import CountryMap from '../../sections/dashboard/default/Map';

dayjs.extend(weekday);
dayjs.extend(localeData);
countries.registerLocale(enLocale);

const calculatePercentageChange = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return (((current - previous) / previous) * 100).toFixed(2);
};

const countryCodeToEmojiFlag = (code) => {
  if (!code) return '';
  return code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
};

const getDialingCode = (countryCode) => {
  try {
    const callingCode = getCountryCallingCode(countryCode);
    return callingCode ? `+${callingCode}` : '';
  } catch (error) {
    return '';
  }
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [category, setCategory] = useState('signup');
  const [granularity, setGranularity] = useState('day');
  const [groupBy, setGroupBy] = useState('date');
  const [countryCode, setCountryCode] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState('custom');
  const [showCustomDatePickers, setShowCustomDatePickers] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState({});
  const [availableCountries, setAvailableCountries] = useState([]);
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
    },
    isHigher: {
      totalSignupUsers: true,
      totalUsers: true,
      totalActiveUsers: true,
      totalSignupsFromBridges: true,
      totalPublications: true,
      totalSignupCountries: true
    }
  });
  const [selectedCountry, setSelectedCountry] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const handleDateRangeSelect = ({ key }) => {
    setDateRangeFilter(key);
    const now = dayjs();

    switch (key) {
      case 'last24hours':
        setStartDate(now);
        setEndDate(now);
        setShowCustomDatePickers(false);
        setDropdownOpen(false);
        break;
      case 'last7days':
        setStartDate(now.subtract(7, 'day'));
        setEndDate(now);
        setShowCustomDatePickers(false);
        setDropdownOpen(false);
        break;
      case 'thismonth':
        setStartDate(now.startOf('month'));
        setEndDate(now);
        setShowCustomDatePickers(false);
        setDropdownOpen(false);
        break;
      case 'custom':
        setShowCustomDatePickers(true);
        break;
      default:
        break;
    }
  };

  const getCustomDropdownContent = () => {
    const dropdownBg = isDarkMode ? '#1e293b' : '#fff';
    const hoverBg = isDarkMode ? '#334155' : '#f5f5f5';
    const borderColor = isDarkMode ? '#334155' : '#f0f0f0';
    const textColor = isDarkMode ? '#e2e8f0' : '#333';
    const labelColor = isDarkMode ? '#94a3b8' : '#666';

    return (
      <div
        style={{
          padding: '12px',
          minWidth: '300px',
          backgroundColor: dropdownBg,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}
      >
        <div
          style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '4px', color: textColor }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = hoverBg)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          onClick={() => handleDateRangeSelect({ key: 'last24hours' })}
        >
          Today
        </div>
        <div
          style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '4px', color: textColor }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = hoverBg)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          onClick={() => handleDateRangeSelect({ key: 'last7days' })}
        >
          Last 7 Days
        </div>
        <div
          style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '4px', color: textColor }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = hoverBg)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          onClick={() => handleDateRangeSelect({ key: 'thismonth' })}
        >
          This Month
        </div>
        <div
          style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '4px', color: textColor }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = hoverBg)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          onClick={() => handleDateRangeSelect({ key: 'custom' })}
        >
          Custom
        </div>
        {showCustomDatePickers && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${borderColor}` }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: labelColor }}>Start Date</label>
              <DatePicker
                placeholder="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: labelColor }}>End Date</label>
              <DatePicker
                placeholder="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
            </div>
            <Button
              type="primary"
              style={{ width: '100%' }}
              onClick={() => {
                setDropdownOpen(false);
              }}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    );
  };

  const getDateRangeLabel = () => {
    switch (dateRangeFilter) {
      case 'last24hours':
        return 'Today';
      case 'last7days':
        return 'Last 7 Days';
      case 'thismonth':
        return 'This Month';
      case 'custom':
        return 'Custom Range';
      default:
        return 'Date Range Filter';
    }
  };

  const handleApplyFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    const appliedFilters = {
      category,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '2021-01-10',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : today,
      granularity,
      // groupBy,
      countryCode: countryCode || undefined
    };

    setFiltersApplied(appliedFilters);
  };

  const handleResetFilters = () => {
    const resetStartDate = dayjs('2021-01-01');
    const resetEndDate = dayjs();

    setCategory('signup');
    // setGranularity('month');
    // setGroupBy('country');
    setCountryCode(null);
    setStartDate(resetStartDate);
    setEndDate(resetEndDate);
    setDateRangeFilter('custom');
    setShowCustomDatePickers(false);

    setFiltersApplied({
      category: 'signup',
      startDate: resetStartDate.format('YYYY-MM-DD'),
      endDate: resetEndDate.format('YYYY-MM-DD')
      // granularity: 'month',
      // groupBy: 'country'
    });
  };

  const handleDownloadData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const appliedStart = filtersApplied.startDate || '2021-01-10';
      const appliedEnd = filtersApplied.endDate || today;

      let apiUrl = `${import.meta.env.VITE_APP_TELEMETRY_API}summary?start_date=${appliedStart}&end_date=${appliedEnd}`;

      if (filtersApplied.countryCode) {
        apiUrl += `&country_code=${filtersApplied.countryCode}`;
      }

      const response = await axios.get(apiUrl);
      const data = response.data.summary;

      const downloadData = {
        metadata: {
          exportDate: new Date().toISOString(),
          filters: {
            category: filtersApplied.category || category,
            startDate: appliedStart,
            endDate: appliedEnd,
            countryCode: filtersApplied.countryCode || countryCode || 'All Countries'
          }
        },
        summary: {
          signup: {
            total_signup_users: data.total_signup_users || 0,
            total_signups_from_bridges: data.total_signups_from_bridges || 0,
            signup_countries: data.signup_countries || [],
            total_signup_countries: data.total_signup_countries || 0
          },
          retained: {
            total_retained_users: data.total_retained_users || 0,
            total_retained_users_with_tokens: data.total_retained_users_with_tokens || 0,
            retained_countries: data.retained_countries || [],
            total_retained_countries: data.total_retained_countries || 0
          },
          publications: {
            total_publications: data.total_publications || 0
          }
        },
        rawData: data
      };

      const jsonString = JSON.stringify(downloadData, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `telemetry-dashboard-data-${timestamp}.json`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Failed to download data. Please try again.');
    }
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const appliedStart = filtersApplied.startDate || '2021-01-10';
        const appliedEnd = filtersApplied.endDate || today;

        const startDateObj = dayjs(appliedStart);
        const endDateObj = dayjs(appliedEnd);
        const periodDuration = endDateObj.diff(startDateObj, 'day');

        const previousStart = startDateObj.subtract(periodDuration + 1, 'day').format('YYYY-MM-DD');
        const previousEnd = startDateObj.subtract(1, 'day').format('YYYY-MM-DD');

        let currentApiUrl = `${import.meta.env.VITE_APP_TELEMETRY_API}summary?start_date=${appliedStart}&end_date=${appliedEnd}`;
        let previousApiUrl = `${import.meta.env.VITE_APP_TELEMETRY_API}summary?start_date=${previousStart}&end_date=${previousEnd}`;

        if (filtersApplied.countryCode) {
          currentApiUrl += `&country_code=${filtersApplied.countryCode}`;
          previousApiUrl += `&country_code=${filtersApplied.countryCode}`;
        }

        // Fetch both current and previous period data
        const [currentResponse, previousResponse] = await Promise.all([axios.get(currentApiUrl), axios.get(previousApiUrl)]);

        const data = currentResponse.data.summary;
        const previousData = previousResponse.data.summary;

        setMetrics({
          totalSignupUsers: data.total_signup_users || 0,
          totalUsers: data.total_retained_users || 0,
          totalActiveUsers: data.total_retained_users_with_tokens || 0,
          totalSignupsFromBridges: data.total_signups_from_bridges || 0,
          totalPublications: data.total_publications || 0,
          totalSignupCountries: data.total_signup_countries || 0,
          percentages: {
            totalSignupUsers: calculatePercentageChange(data.total_signup_users || 0, previousData.total_signup_users || 0),
            totalUsers: calculatePercentageChange(data.total_retained_users || 0, previousData.total_retained_users || 0),
            totalActiveUsers: calculatePercentageChange(
              data.total_retained_users_with_tokens || 0,
              previousData.total_retained_users_with_tokens || 0
            ),
            totalSignupsFromBridges: calculatePercentageChange(
              data.total_signups_from_bridges || 0,
              previousData.total_signups_from_bridges || 0
            ),
            totalPublications: calculatePercentageChange(data.total_publications || 0, previousData.total_publications || 0),
            totalSignupCountries: calculatePercentageChange(data.total_signup_countries || 0, previousData.total_signup_countries || 0)
          },
          isHigher: {
            totalSignupUsers: (data.total_signup_users || 0) >= (previousData.total_signup_users || 0),
            totalUsers: (data.total_retained_users || 0) >= (previousData.total_retained_users || 0),
            totalActiveUsers: (data.total_retained_users_with_tokens || 0) >= (previousData.total_retained_users_with_tokens || 0),
            totalSignupsFromBridges: (data.total_signups_from_bridges || 0) >= (previousData.total_signups_from_bridges || 0),
            totalPublications: (data.total_publications || 0) >= (previousData.total_publications || 0),
            totalSignupCountries: (data.total_signup_countries || 0) >= (previousData.total_signup_countries || 0)
          }
        });

        const effectiveCategory = filtersApplied.category || 'signup';
        const countryCodes = effectiveCategory === 'signup' ? data.signup_countries || [] : data.retained_countries || [];
        const countryOptions = countryCodes
          .map((code) => {
            const upperCode = typeof code === 'string' ? code.toUpperCase() : undefined;
            const isValid = upperCode && countries.isValid(upperCode, 'en');
            if (!isValid) return null;

            const dialingCode = getDialingCode(upperCode);
            const name = countries.getName(upperCode, 'en');
            const flag = countryCodeToEmojiFlag(upperCode);

            return {
              value: upperCode,
              label: dialingCode ? `${flag} ${upperCode}, ${dialingCode} - ${name}` : `${flag} ${upperCode} - ${name}`,
              searchLabel: name
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.searchLabel.localeCompare(b.searchLabel));

        setAvailableCountries(countryOptions);
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
      <Grid size={{ xs: 6, sm: 6, md: 2 }}>
        <AnalyticEcommerce
          title="Sign-up Users"
          count={metrics.totalSignupUsers.toLocaleString()}
          percentage={metrics.percentages.totalSignupUsers}
          isLoss={!metrics.isHigher.totalSignupUsers}
          extra="Number of Signups"
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 2 }}>
        <AnalyticEcommerce
          title="Users"
          count={metrics.totalUsers.toLocaleString()}
          percentage={metrics.percentages.totalUsers}
          isLoss={!metrics.isHigher.totalUsers}
          extra="Number of current users"
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 2 }}>
        <AnalyticEcommerce
          title="Active Users"
          count={metrics.totalActiveUsers.toLocaleString()}
          percentage={metrics.percentages.totalActiveUsers}
          isLoss={!metrics.isHigher.totalActiveUsers}
          extra="Number of users with tokens"
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 2 }}>
        <AnalyticEcommerce
          title="Bridge First Users"
          count={metrics.totalSignupsFromBridges.toLocaleString()}
          percentage={metrics.percentages.totalSignupsFromBridges}
          isLoss={!metrics.isHigher.totalSignupsFromBridges}
          extra="Number of users via bridges"
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 2 }}>
        <AnalyticEcommerce
          title="Publications"
          count={metrics.totalPublications.toLocaleString()}
          percentage={metrics.percentages.totalPublications}
          isLoss={!metrics.isHigher.totalPublications}
          extra="Number of messages published"
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 2 }}>
        <AnalyticEcommerce
          title="Countries"
          count={metrics.totalSignupCountries.toLocaleString()}
          percentage={metrics.percentages.totalSignupCountries}
          isLoss={!metrics.isHigher.totalSignupCountries}
          extra="Available countries with users"
        />
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* Filters Section */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <Box>
          <Grid container spacing={2} sx={{ width: '100%' }}>
            {/* Category Filter */}
            <Grid xs={12} md={3} lg={4}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Category
              </Typography>
              <Select
                placeholder="Select Category"
                value={category}
                onChange={(value) => setCategory(value)}
                style={{ width: '100%' }}
                options={[
                  { value: 'signup', label: 'Sign-up Users' },
                  { value: 'retained', label: 'Users' }
                ]}
              />
            </Grid>

            {/* Date Range Filter Button */}
            <Grid xs={12} md={3} lg={2}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Date range filter
              </Typography>
              <Dropdown
                dropdownRender={() => getCustomDropdownContent()}
                trigger={['click']}
                open={dropdownOpen}
                onOpenChange={(open) => {
                  setDropdownOpen(open);
                  if (!open) {
                    setShowCustomDatePickers(false);
                  }
                }}
              >
                <Button style={{ width: '100%' }} type="default" icon={<CalendarOutlined />}>
                  {getDateRangeLabel()}
                </Button>
              </Dropdown>
            </Grid>

            {/* Country Filter */}
            <Grid xs={12} md={3} lg={2}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Country {availableCountries.length > 0 && `(${availableCountries.length})`}
              </Typography>
              <Select
                showSearch
                allowClear
                placeholder={availableCountries.length === 0 ? 'Loading...' : 'Select Country'}
                value={countryCode}
                onChange={(value) => setCountryCode(value)}
                style={{ width: '100%', minWidth: '250px' }}
                options={availableCountries}
                filterOption={(input, option) => (option?.searchLabel ?? '').toLowerCase().includes(input.toLowerCase())}
                notFoundContent={availableCountries.length === 0 ? 'Loading countries...' : 'No countries found'}
              />
            </Grid>

            {/* Buttons */}
            <Grid xs={12} md={3} lg={4} container spacing={1} sx={{ mt: { md: 3.5 } }}>
              <Grid xs={4} md={12} lg={4}>
                <Button type="primary" style={{ width: '100%' }} onClick={handleApplyFilters}>
                  Apply
                </Button>
              </Grid>
              <Grid xs={4} md={12} lg={4}>
                <Button type="text" icon={<ReloadOutlined />} style={{ width: '100%' }} onClick={handleResetFilters}>
                  Reset
                </Button>
              </Grid>
              <Grid xs={4} md={12} lg={4}>
                <Button type="default" icon={<DownloadOutlined />} style={{ width: '100%' }} onClick={handleDownloadData}>
                  Download Data
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      {/* row 2: Combined Chart and Map */}
      <Grid size={{ xs: 12, md: 7, lg: 8.5 }}>
        <CountryMap filters={filtersApplied} selectedCountry={selectedCountry} onCountrySelect={setSelectedCountry} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 3.5 }}>
        <CountryTable filters={filtersApplied} onCountryClick={setSelectedCountry} selectedCountry={selectedCountry} />
      </Grid>

      {/* row 3: Country Table and User Table */}
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <UserTable filters={filtersApplied} />
      </Grid>
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <CombinedChartCard filters={filtersApplied} />
      </Grid>
    </Grid>
  );
}
