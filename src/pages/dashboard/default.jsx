// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// ant design
import { DatePicker, Select, Button, Dropdown, Switch, Radio } from 'antd';
import 'antd/dist/reset.css';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import ErrorDisplay from 'components/ErrorDisplay';

import CombinedChartCard from 'sections/dashboard/default/CombinedChartCard';
import UserTable from 'sections/dashboard/default/UserTable';
import UserRetentionMetrics from 'sections/dashboard/default/UserRetentionMetrics';
import ShutdownEarlyWarning from 'sections/dashboard/default/ShutdownEarlyWarning';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { ReloadOutlined, CalendarOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { getCountryCallingCode } from 'libphonenumber-js';

import CountryTable from '../../sections/dashboard/default/CountryTable';
import CountryMap from '../../sections/dashboard/default/Map';
import { Tooltip } from '@mui/material';

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
  const [category, setCategory] = useState('all');
  const [granularity, setGranularity] = useState('day');
  const [groupBy, setGroupBy] = useState('date');
  const [countryCode, setCountryCode] = useState(null);
  const [type, setType] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState('custom');
  const [showCustomDatePickers, setShowCustomDatePickers] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState({});
  const [availableCountries, setAvailableCountries] = useState([]);
  const [showTotals, setShowTotals] = useState(true);
  const [metrics, setMetrics] = useState({
    totalSignupUsers: 0,
    totalUsers: 0,
    totalActiveUsers: 0,
    totalEmailSignups: 0,
    totalEmailRetained: 0,
    totalSignupsFromBridges: 0,
    totalPublications: 0,
    totalSignupCountries: 0,
    totalRetainedCountries: 0,
    percentages: {
      totalSignupUsers: 0,
      totalUsers: 0,
      totalActiveUsers: 0,
      totalEmailSignups: 0,
      totalEmailRetained: 0,
      totalSignupsFromBridges: 0,
      totalPublications: 0,
      totalSignupCountries: 0,
      totalRetainedCountries: 0
    },
    isHigher: {
      totalSignupUsers: true,
      totalUsers: true,
      totalActiveUsers: true,
      totalEmailSignups: true,
      totalEmailRetained: true,
      totalSignupsFromBridges: true,
      totalPublications: true,
      totalSignupCountries: true,
      totalRetainedCountries: true
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
        if (startDate && endDate) {
          return `${startDate.format('YYYY-MM-DD')} - ${endDate.format('YYYY-MM-DD')}`;
        }
        return '2020-01-10 - Today';
      default:
        return 'Date Range Filter';
    }
  };

  const handleApplyFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    const appliedFilters = {
      category,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '2020-01-10',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : today,
      granularity,
      // groupBy,
      countryCode: countryCode || undefined,
      type: type || undefined,
      origin: origin || undefined
    };

    setFiltersApplied(appliedFilters);
  };

  const handleResetFilters = () => {
    const resetStartDate = dayjs('2020-01-01');
    const resetEndDate = dayjs();

    setCategory('all');
    // setGranularity('month');
    // setGroupBy('country');
    setCountryCode(null);
    setType(null);
    setOrigin(null);
    setStartDate(resetStartDate);
    setEndDate(resetEndDate);
    setDateRangeFilter('custom');
    setShowCustomDatePickers(false);

    setFiltersApplied({
      category: 'all',
      startDate: resetStartDate.format('YYYY-MM-DD'),
      endDate: resetEndDate.format('YYYY-MM-DD')
      // granularity: 'month',
      // groupBy: 'country'
    });
  };

  const handleDownloadData = async () => {
    setDownloading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const appliedStart = filtersApplied.startDate || '2020-01-10';
      const appliedEnd = filtersApplied.endDate || today;
      const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;

      const countryParam = filtersApplied.countryCode ? `&country_code=${filtersApplied.countryCode}` : '';
      const typeParam = filtersApplied.type ? `&type=${filtersApplied.type}` : '';
      const originParam = filtersApplied.origin ? `&origin=${filtersApplied.origin}` : '';
      const currentCategory = filtersApplied.category || category;

      const summaryUrl = `${baseUrl}summary?start_date=${appliedStart}&end_date=${appliedEnd}${countryParam}${typeParam}${originParam}`;
      const summaryResponse = await axios.get(summaryUrl);
      const summaryData = summaryResponse.data.summary;

      const fetchAllPages = async (endpoint, category, groupBy = 'date') => {
        const params = {
          category,
          start_date: appliedStart,
          end_date: appliedEnd,
          granularity: 'day',
          group_by: groupBy,
          page: 1,
          page_size: 100
        };

        if (filtersApplied.countryCode) {
          params.country_code = filtersApplied.countryCode;
        }

        if (filtersApplied.type) {
          params.type = filtersApplied.type;
        }

        if (filtersApplied.origin) {
          params.origin = filtersApplied.origin;
        }

        const firstResponse = await axios.get(`${baseUrl}${endpoint}`, { params });
        const totalPages = firstResponse?.data?.[category]?.pagination?.total_pages || 1;
        let allData = firstResponse?.data?.[category]?.data ?? [];

        if (totalPages > 1) {
          const pagePromises = [];
          for (let page = 2; page <= totalPages; page++) {
            pagePromises.push(axios.get(`${baseUrl}${endpoint}`, { params: { ...params, page } }));
          }

          const responses = await Promise.all(pagePromises);
          responses.forEach((response) => {
            const pageData = response?.data?.[category]?.data ?? [];
            allData = [...allData, ...pageData];
          });
        }

        return allData;
      };

      const signupByDate = await fetchAllPages('signup', 'signup', 'date');
      const signupByCountry = await fetchAllPages('signup', 'signup', 'country');

      const retainedByDate = await fetchAllPages('retained', 'retained', 'date');
      const retainedByCountry = await fetchAllPages('retained', 'retained', 'country');

      const pubParams = {
        start_date: appliedStart,
        end_date: appliedEnd,
        page: 1,
        page_size: 100
      };
      if (filtersApplied.countryCode) {
        pubParams.country_code = filtersApplied.countryCode;
      }
      if (filtersApplied.type) {
        pubParams.type = filtersApplied.type;
      }
      if (filtersApplied.origin) {
        pubParams.origin = filtersApplied.origin;
      }

      const firstPubResponse = await axios.get(`${baseUrl}publications`, { params: pubParams });
      const totalPubPages = firstPubResponse?.data?.publications?.pagination?.total_pages || 1;
      let allPublications = firstPubResponse?.data?.publications?.data ?? [];

      if (totalPubPages > 1) {
        const pubPagePromises = [];
        for (let page = 2; page <= totalPubPages; page++) {
          pubPagePromises.push(axios.get(`${baseUrl}publications`, { params: { ...pubParams, page } }));
        }

        const pubResponses = await Promise.all(pubPagePromises);
        pubResponses.forEach((response) => {
          const pageData = response?.data?.publications?.data ?? [];
          allPublications = [...allPublications, ...pageData];
        });
      }

      const downloadData = {
        metadata: {
          exportDate: new Date().toISOString(),
          filters: {
            category: currentCategory,
            startDate: appliedStart,
            endDate: appliedEnd,
            countryCode: filtersApplied.countryCode || 'All Countries',
            type: filtersApplied.type || 'All Types',
            origin: filtersApplied.origin || 'All Origins'
          },
          recordCounts: {
            signupByDate: signupByDate.length,
            signupByCountry: signupByCountry.length,
            retainedByDate: retainedByDate.length,
            retainedByCountry: retainedByCountry.length,
            publications: allPublications.length
          }
        },
        summary: {
          signup: {
            total_signup_users: summaryData.total_signup_users || 0,
            total_signups_from_bridges: summaryData.total_signups_from_bridges || 0,
            signup_countries: summaryData.signup_countries || [],
            total_signup_countries: summaryData.total_signup_countries || 0
          },
          retained: {
            total_retained_users: summaryData.total_retained_users || 0,
            total_retained_users_with_tokens: summaryData.total_retained_users_with_tokens || 0,
            retained_countries: summaryData.retained_countries || [],
            total_retained_countries: summaryData.total_retained_countries || 0
          },
          publications: {
            total_publications: summaryData.total_publications || 0
          }
        },
        detailedData: {
          signup: {
            byDate: signupByDate,
            byCountry: signupByCountry
          },
          retained: {
            byDate: retainedByDate,
            byCountry: retainedByCountry
          },
          publications: allPublications
        },
        rawSummary: summaryData
      };

      const jsonString = JSON.stringify(downloadData, null, 2);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `telemetry-dashboard-complete-${timestamp}.json`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Failed to download data. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const appliedStart = filtersApplied.startDate || '2020-01-10';
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

        if (filtersApplied.type) {
          currentApiUrl += `&type=${filtersApplied.type}`;
          previousApiUrl += `&type=${filtersApplied.type}`;
        }

        if (filtersApplied.origin) {
          currentApiUrl += `&origin=${filtersApplied.origin}`;
          previousApiUrl += `&origin=${filtersApplied.origin}`;
        }

        const [currentResponse, previousResponse] = await Promise.all([axios.get(currentApiUrl), axios.get(previousApiUrl)]);

        const data = currentResponse.data.summary;
        const previousData = previousResponse.data.summary;

        setMetrics({
          totalSignupUsers: data.total_signup_users || 0,
          totalUsers: data.total_retained_users || 0,
          totalActiveUsers: data.total_retained_users_with_tokens || 0,
          totalEmailSignups: data.total_signup_users_with_emails || 0,
          totalEmailRetained: data.total_retained_users_with_emails || 0,
          totalSignupsFromBridges: data.total_signups_from_bridges || 0,
          totalPublications: data.total_publications || 0,
          totalSignupCountries: data.total_signup_countries || 0,
          totalRetainedCountries: data.total_retained_countries || 0,
          percentages: {
            totalSignupUsers: calculatePercentageChange(data.total_signup_users || 0, previousData.total_signup_users || 0),
            totalUsers: calculatePercentageChange(data.total_retained_users || 0, previousData.total_retained_users || 0),
            totalActiveUsers: calculatePercentageChange(
              data.total_retained_users_with_tokens || 0,
              previousData.total_retained_users_with_tokens || 0
            ),
            totalEmailSignups: calculatePercentageChange(
              data.total_signup_users_with_emails || 0,
              previousData.total_signup_users_with_emails || 0
            ),
            totalEmailRetained: calculatePercentageChange(
              data.total_retained_users_with_emails || 0,
              previousData.total_retained_users_with_emails || 0
            ),
            totalSignupsFromBridges: calculatePercentageChange(
              data.total_signups_from_bridges || 0,
              previousData.total_signups_from_bridges || 0
            ),
            totalPublications: calculatePercentageChange(data.total_publications || 0, previousData.total_publications || 0),
            totalSignupCountries: calculatePercentageChange(data.total_signup_countries || 0, previousData.total_signup_countries || 0),
            totalRetainedCountries: calculatePercentageChange(
              data.total_retained_countries || 0,
              previousData.total_retained_countries || 0
            )
          },
          isHigher: {
            totalSignupUsers: (data.total_signup_users || 0) >= (previousData.total_signup_users || 0),
            totalUsers: (data.total_retained_users || 0) >= (previousData.total_retained_users || 0),
            totalActiveUsers: (data.total_retained_users_with_tokens || 0) >= (previousData.total_retained_users_with_tokens || 0),
            totalEmailSignups: (data.total_signup_users_with_emails || 0) >= (previousData.total_signup_users_with_emails || 0),
            totalEmailRetained: (data.total_retained_users_with_emails || 0) >= (previousData.total_retained_users_with_emails || 0),
            totalSignupsFromBridges: (data.total_signups_from_bridges || 0) >= (previousData.total_signups_from_bridges || 0),
            totalPublications: (data.total_publications || 0) >= (previousData.total_publications || 0),
            totalSignupCountries: (data.total_signup_countries || 0) >= (previousData.total_signup_countries || 0),
            totalRetainedCountries: (data.total_retained_countries || 0) >= (previousData.total_retained_countries || 0)
          }
        });

        const effectiveCategory = filtersApplied.category || 'all';
        let countryCodes = [];
        if (effectiveCategory === 'all') {
          const signupCountries = data.signup_countries || [];
          const retainedCountries = data.retained_countries || [];
          countryCodes = Array.from(new Set([...signupCountries, ...retainedCountries]));
        } else {
          countryCodes = effectiveCategory === 'signup' ? data.signup_countries || [] : data.retained_countries || [];
        }
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
        setError('Unable to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [filtersApplied]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      {/* <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Open Telemetry</Typography>
      </Grid> */}

      {/* Toggle for Totals Visibility */}
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 0 }}>
          <Typography variant="body2" sx={{ mr: 1.5 }}>
            Show Totals
          </Typography>
          <Switch checked={showTotals} onChange={(checked) => setShowTotals(checked)} />
        </Box>
      </Grid>

      {/* Sign-up Category */}
      {showTotals && (
        <>
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Sign-up
              </Typography>
              <Tooltip title="Users that created a RelaySMS account" arrow sx={{ color: 'text.secondary' }}>
                <InfoCircleOutlined sx={{ fontSize: 15, color: 'text.secondary', cursor: 'help' }} />
              </Tooltip>
            </Box>
            <Grid container spacing={1}>
              <Grid size={12}>
                <AnalyticEcommerce
                  title="Sign-up Users"
                  count={metrics.totalSignupUsers === 0 ? '-' : metrics.totalSignupUsers.toLocaleString()}
                  percentage={metrics.totalSignupUsers === 0 ? null : metrics.percentages.totalSignupUsers}
                  isLoss={!metrics.isHigher.totalSignupUsers}
                  extra="Total number of signups"
                />
              </Grid>
              <Grid size={12}>
                <AnalyticEcommerce
                  title="Sign-up Countries"
                  count={metrics.totalSignupCountries === 0 ? '-' : metrics.totalSignupCountries.toLocaleString()}
                  percentage={metrics.totalSignupCountries === 0 ? null : metrics.percentages.totalSignupCountries}
                  isLoss={!metrics.isHigher.totalSignupCountries}
                  extra="Countries with signups"
                />
              </Grid>
              <Grid size={12}>
                <AnalyticEcommerce
                  title="Email Signups"
                  count={metrics.totalEmailSignups === 0 ? '-' : metrics.totalEmailSignups.toLocaleString()}
                  percentage={metrics.totalEmailSignups === 0 ? null : metrics.percentages.totalEmailSignups}
                  isLoss={!metrics.isHigher.totalEmailSignups}
                  extra="Signups with email"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Users Category */}
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Current Users
              </Typography>
              <Tooltip title="Users with accounts that have not been deleted" arrow>
                <InfoCircleOutlined sx={{ fontSize: 18, color: 'text.secondary', cursor: 'help' }} />
              </Tooltip>
            </Box>
            <Grid container spacing={1}>
              <Grid size={12}>
                <AnalyticEcommerce
                  title="Current Users"
                  count={metrics.totalUsers === 0 ? '-' : metrics.totalUsers.toLocaleString()}
                  percentage={metrics.totalUsers === 0 ? null : metrics.percentages.totalUsers}
                  isLoss={!metrics.isHigher.totalUsers}
                  extra="Total current users"
                />
              </Grid>
              <Grid size={12}>
                <AnalyticEcommerce
                  title="Current Countries"
                  count={metrics.totalRetainedCountries === 0 ? '-' : metrics.totalRetainedCountries.toLocaleString()}
                  percentage={metrics.totalRetainedCountries === 0 ? null : metrics.percentages.totalRetainedCountries}
                  isLoss={!metrics.isHigher.totalRetainedCountries}
                  extra="Countries with current users"
                />
              </Grid>
              <Grid size={12}>
                <AnalyticEcommerce
                  title="Email Current Users"
                  count={metrics.totalEmailRetained === 0 ? '-' : metrics.totalEmailRetained.toLocaleString()}
                  percentage={metrics.totalEmailRetained === 0 ? null : metrics.percentages.totalEmailRetained}
                  isLoss={!metrics.isHigher.totalEmailRetained}
                  extra="Current from email signups"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Bridge Category */}
          <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}>
            <Grid container spacing={1} sx={{ mt: 4.2 }}>
              <Grid size={12}>
                <AnalyticEcommerce
                  title="Bridge First Users"
                  count={metrics.totalSignupsFromBridges === 0 ? '-' : metrics.totalSignupsFromBridges.toLocaleString()}
                  percentage={metrics.totalSignupsFromBridges === 0 ? null : metrics.percentages.totalSignupsFromBridges}
                  isLoss={!metrics.isHigher.totalSignupsFromBridges}
                  extra="Users via bridges"
                />
              </Grid>
              <Grid size={12}>
                <AnalyticEcommerce
                  title="Users with Tokens"
                  count={metrics.totalActiveUsers === 0 ? '-' : metrics.totalActiveUsers.toLocaleString()}
                  percentage={metrics.totalActiveUsers === 0 ? null : metrics.percentages.totalActiveUsers}
                  isLoss={!metrics.isHigher.totalActiveUsers}
                  extra="Active users with tokens"
                />
              </Grid>
              <Grid size={12}>
                <AnalyticEcommerce
                  title="Publications"
                  count={metrics.totalPublications === 0 ? '-' : metrics.totalPublications.toLocaleString()}
                  percentage={metrics.totalPublications === 0 ? null : metrics.percentages.totalPublications}
                  isLoss={!metrics.isHigher.totalPublications}
                  extra="Messages published"
                />
              </Grid>
            </Grid>
          </Grid>
        </>
      )}

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
                style={{ width: '120px' }}
                options={[
                  { value: 'all', label: 'All' },
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
                popupRender={() => getCustomDropdownContent()}
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

            {/* Type Filter */}
            <Grid xs={12} md={6} lg={3}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Type
              </Typography>
              <Radio.Group value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%' }}>
                <Radio.Button value={null}>All</Radio.Button>
                <Radio.Button value="phone_number">Phone</Radio.Button>
                <Radio.Button value="email_address">Email</Radio.Button>
              </Radio.Group>
            </Grid>

            {/* Origin Filter */}
            <Grid xs={12} md={6} lg={3}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Origin
              </Typography>
              <Radio.Group value={origin} onChange={(e) => setOrigin(e.target.value)} style={{ width: '100%' }}>
                <Radio.Button value={null}>All</Radio.Button>
                <Radio.Button value="web">Web</Radio.Button>
                <Radio.Button value="bridge">Bridge</Radio.Button>
              </Radio.Group>
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
                <Button
                  type="default"
                  icon={<DownloadOutlined />}
                  style={{ width: '100%' }}
                  onClick={handleDownloadData}
                  loading={downloading}
                  disabled={downloading}
                >
                  {downloading ? 'Downloading...' : 'Download Data'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      {/* row 2: Combined Chart and Map */}
      <Grid size={12}>
        <MainCard>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <CountryMap filters={filtersApplied} selectedCountry={selectedCountry} onCountrySelect={setSelectedCountry} />
            </Grid>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <CountryTable filters={filtersApplied} onCountryClick={setSelectedCountry} selectedCountry={selectedCountry} />
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {/* row 3: Country Table and User Table */}
      <Grid size={12} sx={{ mb: 4 }}>
        <MainCard>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <UserTable filters={filtersApplied} />
            </Grid>
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <CombinedChartCard filters={filtersApplied} />
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {/* row 4: User Retention Metrics */}
      {/* <Grid size={12} sx={{ mb: 4 }}>
        <UserRetentionMetrics filters={filtersApplied} />
      </Grid> */}

      {/* row 5: Internet Shutdown Early Warning */}
      {/* <Grid size={12} sx={{ mb: 4 }}>
        <ShutdownEarlyWarning filters={filtersApplied} />
      </Grid> */}
    </Grid>
  );
}
