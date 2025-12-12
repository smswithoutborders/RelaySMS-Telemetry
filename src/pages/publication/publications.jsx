// material-ui
import TableSortLabel from '@mui/material/TableSortLabel';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { useTheme } from '@mui/material/styles';

// antd
import { Button, Select, DatePicker, Space, Dropdown } from 'antd';
import { ReloadOutlined, CalendarOutlined, DownloadOutlined } from '@ant-design/icons';

// components
import Loader from 'components/Loader';
import MainCard from 'components/MainCard';

// project imports
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import PublicationChart from 'sections/publications/PublicationChart';
import PlatformDistributionChart from 'sections/publications/PlatformDistributionChart';
import PublicationMap from 'sections/publications/PublicationMap';
import UsageHeatmap from 'sections/publications/UsageHeatmap';
import PlatformSuccessRateChart, { PlatformSuccessRateSummary } from 'sections/publications/PlatformSuccessRateChart';

import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.extend(localeData);

countries.registerLocale(enLocale);

const maxValues = {
  totalPublication: 50000,
  totalPublished: 30000,
  totalFailed: 20000
};

const calculatePercentage = (value, max) => {
  return max ? Math.min((value / max) * 100, 100).toFixed(2) : '0.00';
};

const calculatePercentageChange = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return (((current - previous) / previous) * 100).toFixed(2);
};

const headCells = [
  { id: 'id', align: 'left', label: 'ID' },
  { id: 'date', align: 'left', label: 'Date', orderBy: 'date_created' },
  { id: 'country', align: 'left', label: 'Country' },
  { id: 'platform', align: 'left', label: 'Platform' },
  { id: 'source', align: 'left', label: 'Source' },
  { id: 'status', align: 'left', label: 'Status' }
];

function PublicationTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const columnWidths = {
    id: '8%',
    date: '28%',
    country: '20%',
    platform: '18%',
    source: '13%',
    status: '13%'
  };

  return (
    <TableHead sx={{ backgroundColor: 'background.default', position: 'sticky', top: 0, zIndex: 1 }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              width: columnWidths[headCell.id],
              fontSize: '0.75rem',
              padding: '8px',
              whiteSpace: headCell.id === 'date' ? 'nowrap' : 'normal'
            }}
          >
            {headCell.orderBy ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

PublicationTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

export default function Publications() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [country, setCountry] = useState('');
  const [availableCountries, setAvailableCountries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeFilter, setDateRangeFilter] = useState('custom');
  const [showCustomDatePickers, setShowCustomDatePickers] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [metrics, setMetrics] = useState({
    totalPublication: 0,
    totalPublished: 0,
    totalFailed: 0,
    percentages: {
      totalPublication: 0,
      totalPublished: 0,
      totalFailed: 0
    },
    isHigher: {
      totalPublication: true,
      totalPublished: true,
      totalFailed: true
    }
  });
  const [tableData, setTableData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setFiltersApplied((prevFilters) => ({
      ...prevFilters,
      sort_by: property,
      sort_order: isAsc ? 'desc' : 'asc'
    }));
  };

  const today = new Date().toISOString().split('T')[0];

  const handleApplyFilters = () => {
    const appliedFilters = {
      platform,
      startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '2021-01-10',
      endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : today,
      status,
      source,
      country
    };
    setFiltersApplied(appliedFilters);
    setPage(0);
  };

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
        return '2021-01-10 - Today';
      default:
        return 'Date Range Filter';
    }
  };

  const handleResetFilters = () => {
    setPlatform('');
    setStatus('');
    setSource('');
    setCountry('');
    setStartDate(null);
    setEndDate(null);
    setDateRangeFilter('custom');
    setShowCustomDatePickers(false);
    setFiltersApplied({});
  };

  const handleDownloadData = async () => {
    setDownloading(true);
    try {
      const baseUrl = import.meta.env.VITE_APP_TELEMETRY_API;
      const appliedStart = filtersApplied.startDate || '2021-01-10';
      const appliedEnd = filtersApplied.endDate || today;

      const params = {
        start_date: appliedStart,
        end_date: appliedEnd,
        page: 1,
        page_size: 100
      };

      if (filtersApplied.platform) params.platform_name = filtersApplied.platform;
      if (filtersApplied.status) params.status = filtersApplied.status;
      if (filtersApplied.source) params.source = filtersApplied.source;
      if (filtersApplied.country) params.country_code = filtersApplied.country;

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

      const downloadData = {
        metadata: {
          exportDate: new Date().toISOString(),
          totalRecords: allPublications.length,
          filters: {
            platform: filtersApplied.platform || 'All',
            status: filtersApplied.status || 'All',
            source: filtersApplied.source || 'All',
            country: filtersApplied.country || 'All',
            startDate: appliedStart,
            endDate: appliedEnd
          }
        },
        publications: allPublications
      };

      const jsonString = JSON.stringify(downloadData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `publications-data-${timestamp}.json`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading publications data:', error);
      alert('Failed to download data. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const countryCodeToEmojiFlag = (code) => {
    if (!code) return '';
    return code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
  };

  const formatDateToGMTPlus1 = (dateString) => {
    return dayjs.utc(dateString).local().format('MMM DD, YYYY hh:mm:ss A');
  };

  const getPlatformLogo = (platformName) => {
    const platform = platformName?.toLowerCase();
    switch (platform) {
      case 'telegram':
        return '/telegram.png';
      case 'twitter':
      case 'x':
        return '/x-twitter-brands-solid.svg';
      case 'gmail':
        return '/Gmail_icon.svg';
      case 'bluesky':
        return '/Bluesky_Logo.svg';
      case 'mastodon':
        return '/mastodon.svg';
      case 'slack':
        return '/slack.png';
      case 'email_bridge':
      case 'email bridge':
        return '/logo.svg';
      default:
        return '/logo.svg';
    }
  };

  const formatPlatformName = (platformName) => {
    if (!platformName) return '';
    if (platformName.toLowerCase() === 'email_bridge') {
      return 'EMAIL BRIDGE';
    }
    return platformName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const appliedStart = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '2021-01-10';
        const appliedEnd = endDate ? dayjs(endDate).format('YYYY-MM-DD') : today;

        const startDateObj = dayjs(appliedStart);
        const endDateObj = dayjs(appliedEnd);
        const periodDuration = endDateObj.diff(startDateObj, 'day');

        const previousStart = startDateObj.subtract(periodDuration + 1, 'day').format('YYYY-MM-DD');
        const previousEnd = startDateObj.subtract(1, 'day').format('YYYY-MM-DD');

        const params = {
          start_date: appliedStart,
          end_date: appliedEnd,
          page: page + 1,
          page_size: rowsPerPage
        };

        const previousParams = {
          start_date: previousStart,
          end_date: previousEnd,
          page: 1,
          page_size: rowsPerPage
        };

        if (platform) {
          params.platform_name = platform;
          previousParams.platform_name = platform;
        }
        if (status) {
          params.status = status;
          previousParams.status = status;
        }
        if (source) {
          params.source = source;
          previousParams.source = source;
        }
        if (country) {
          params.country_code = country;
          previousParams.country_code = country;
        }

        const [response, previousResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_TELEMETRY_API}publications`, { params }),
          axios.get(`${import.meta.env.VITE_APP_TELEMETRY_API}publications`, { params: previousParams })
        ]);

        const data = response.data.publications?.data || [];
        const previousData = previousResponse.data.publications || {};

        const formatted = Array.isArray(data)
          ? data.map((item) => {
              const rawCode = item?.country_code?.toUpperCase() || 'UNKNOWN';
              const name = countries.isValid(rawCode, 'en') ? countries.getName(rawCode, 'en') : 'Unknown';

              const flag = countries.isValid(rawCode, 'en') ? countryCodeToEmojiFlag(rawCode) : '';

              return {
                country: name || rawCode,
                flag: flag || '',
                country_code: rawCode,
                id: item.id,
                date_created: item.date_created,
                platform_name: item.platform_name,
                source: item.source,
                status: item.status
              };
            })
          : [];

        let sortedFormatted = [...formatted];
        if (orderBy) {
          sortedFormatted.sort((a, b) => {
            const isAsc = order === 'asc';
            const valueA = a[orderBy];
            const valueB = b[orderBy];

            if (orderBy === 'date_created') {
              const dateA = new Date(valueA);
              const dateB = new Date(valueB);
              return isAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
              return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }

            if (typeof valueA === 'number' && typeof valueB === 'number') {
              return isAsc ? valueA - valueB : valueB - valueA;
            }

            return 0;
          });
        }

        const currentPublications = response.data.publications?.total_publications || 0;
        const currentPublished = response.data.publications?.total_published || 0;
        const currentFailed = response.data.publications?.total_failed || 0;

        const previousPublications = previousData.total_publications || 0;
        const previousPublished = previousData.total_published || 0;
        const previousFailed = previousData.total_failed || 0;

        setMetrics({
          totalPublication: currentPublications,
          totalPublished: currentPublished,
          totalFailed: currentFailed,
          percentages: {
            totalPublication: calculatePercentageChange(currentPublications, previousPublications),
            totalPublished: calculatePercentageChange(currentPublished, previousPublished),
            totalFailed: calculatePercentageChange(currentFailed, previousFailed)
          },
          isHigher: {
            totalPublication: currentPublications >= previousPublications,
            totalPublished: currentPublished >= previousPublished,
            totalFailed: currentFailed >= previousFailed
          }
        });
        setTableData(sortedFormatted);
        setTotalRows(response.data.publications?.pagination?.total_records || 0);

        setError(null);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to fetch metrics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersApplied, page, rowsPerPage, order, orderBy]);

  useEffect(() => {
    const fetchAllCountries = async () => {
      try {
        const params = {
          start_date: '2021-01-10',
          end_date: new Date().toISOString().split('T')[0],
          page: 1,
          page_size: 100
        };

        const response = await axios.get(`${import.meta.env.VITE_APP_TELEMETRY_API}publications`, { params });
        const data = response.data.publications?.data || [];

        const formatted = Array.isArray(data)
          ? data.map((item) => {
              const rawCode = item?.country_code?.toUpperCase() || 'UNKNOWN';
              const name = countries.isValid(rawCode, 'en') ? countries.getName(rawCode, 'en') : 'Unknown';
              const flag = countries.isValid(rawCode, 'en') ? countryCodeToEmojiFlag(rawCode) : '';

              return {
                country: name || rawCode,
                flag: flag || '',
                country_code: rawCode
              };
            })
          : [];

        const uniqueCountries = [...new Map(formatted.map((item) => [item.country_code, item])).values()]
          .filter((item) => item.country_code !== 'UNKNOWN')
          .sort((a, b) => a.country.localeCompare(b.country));

        setAvailableCountries(uniqueCountries);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };

    fetchAllCountries();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Publications</Typography>
          <Button type="default" icon={<DownloadOutlined />} onClick={handleDownloadData} loading={downloading} disabled={downloading}>
            {downloading ? 'Downloading...' : 'Download Data'}
          </Button>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <AnalyticEcommerce
          title="Publications"
          count={metrics.totalPublication.toLocaleString()}
          percentage={metrics.totalPublication === 0 ? null : metrics.percentages.totalPublication}
          isLoss={!metrics.isHigher.totalPublication}
          extra="All Publications"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <AnalyticEcommerce
          title="Published"
          count={metrics.totalPublished.toLocaleString()}
          percentage={metrics.totalPublished === 0 ? null : metrics.percentages.totalPublished}
          isLoss={!metrics.isHigher.totalPublished}
          extra="Successful Publications"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <AnalyticEcommerce
          title="Failed"
          count={metrics.totalFailed.toLocaleString()}
          // percentage={metrics.totalFailed === 0 ? null : metrics.percentages.totalFailed}
          isLoss={metrics.isHigher.totalFailed}
          extra="Failed Publications"
        />
      </Grid>

      {/* Filters */}
      <Grid size={12}>
        <Box>
          <Space wrap size="middle">
            <Select
              placeholder="Platform"
              value={platform || undefined}
              onChange={(value) => setPlatform(value || '')}
              style={{ width: 200 }}
              allowClear
              options={[
                {
                  value: 'gmail',
                  label: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img src="/Gmail_icon.svg" alt="Gmail" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                      <span>Gmail</span>
                    </Box>
                  )
                },
                {
                  value: 'twitter',
                  label: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img
                        src="/x-twitter-brands-solid.svg"
                        alt="Twitter"
                        style={{
                          width: 16,
                          height: 16,
                          objectFit: 'contain',
                          filter: isDarkMode ? 'brightness(0) invert(1)' : 'none'
                        }}
                      />
                      <span>Twitter</span>
                    </Box>
                  )
                },
                {
                  value: 'telegram',
                  label: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img src="/telegram.png" alt="Telegram" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                      <span>Telegram</span>
                    </Box>
                  )
                },
                {
                  value: 'bluesky',
                  label: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img src="/Bluesky_Logo.svg" alt="Bluesky" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                      <span>Bluesky</span>
                    </Box>
                  )
                },
                {
                  value: 'mastodon',
                  label: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img src="/mastodon.svg" alt="Mastodon" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                      <span>Mastodon</span>
                    </Box>
                  )
                },
                // {
                //   value: 'slack',
                //   label: (
                //     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                //       <img src="/slack.png" alt="Slack" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                //       <span>Slack</span>
                //     </Box>
                //   )
                // },
                {
                  value: 'email_bridge',
                  label: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img src="/logo.svg" alt="Email Bridge" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                      <span>Email Bridge</span>
                    </Box>
                  )
                }
              ]}
            />

            <Select
              placeholder="Status"
              value={status || undefined}
              onChange={(value) => setStatus(value || '')}
              style={{ width: 150 }}
              allowClear
              options={[
                { value: 'published', label: 'Published' },
                { value: 'failed', label: 'Failed' }
              ]}
            />

            <Select
              placeholder="Source"
              value={source || undefined}
              onChange={(value) => setSource(value || '')}
              style={{ width: 150 }}
              allowClear
              options={[
                { value: 'platforms', label: 'Platform' },
                { value: 'bridges', label: 'Bridge' }
              ]}
            />

            <Select
              placeholder="Country"
              value={country || undefined}
              onChange={(value) => setCountry(value || '')}
              style={{ width: 200 }}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label?.props?.children?.[1]?.props?.children || '').toLowerCase().includes(input.toLowerCase())
              }
              options={availableCountries.map((item) => ({
                value: item.country_code,
                label: (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{item.flag}</span>
                    <span>{item.country}</span>
                  </Box>
                )
              }))}
            />

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
              <Button style={{ width: 200 }} type="default" icon={<CalendarOutlined />}>
                {getDateRangeLabel()}
              </Button>
            </Dropdown>

            <Button type="primary" onClick={handleApplyFilters}>
              Apply
            </Button>

            <Button type="text" icon={<ReloadOutlined />} onClick={handleResetFilters}>
              Reset
            </Button>
          </Space>
        </Box>
      </Grid>

      {/* Table and Map */}
      <Grid size={12}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7, lg: 7.5 }}>
              <TableContainer sx={{ minHeight: 400, maxHeight: 400 }}>
                {loading ? (
                  <Box display="flex" justifyContent="center" p={4}>
                    <Loader size={40} fullScreen={false} />
                  </Box>
                ) : error ? (
                  <Box display="flex" justifyContent="center" p={4}>
                    <Typography color="error">{error}</Typography>
                  </Box>
                ) : (
                  <Table>
                    <PublicationTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                    <TableBody>
                      {tableData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell sx={{ width: '8%', fontSize: '0.80rem', padding: '8px' }}>{row.id}</TableCell>
                          <TableCell sx={{ width: '8%', fontSize: '0.80rem', padding: '8px', whiteSpace: 'nowrap' }}>
                            {formatDateToGMTPlus1(row.date_created)}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              if (row.country_code && row.country_code !== 'UNKNOWN') {
                                setSelectedCountry(selectedCountry === row.country_code ? null : row.country_code);
                              }
                            }}
                            sx={{
                              width: '28%',
                              fontSize: '0.85rem',
                              padding: '8px',
                              cursor: row.country_code && row.country_code !== 'UNKNOWN' ? 'pointer' : 'default',
                              '&:hover': {
                                backgroundColor: row.country_code && row.country_code !== 'UNKNOWN' ? 'action.hover' : 'transparent'
                              },
                              fontWeight: selectedCountry === row.country_code ? 'bold' : 'normal',
                              color: selectedCountry === row.country_code ? 'primary.main' : 'inherit'
                            }}
                          >
                            <span style={{ marginRight: 8 }}>{row.flag}</span>
                            {row.country ? row.country : 'No Country'}
                          </TableCell>
                          <TableCell sx={{ width: '18%', fontSize: '0.75rem', padding: '8px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <img
                                src={getPlatformLogo(row.platform_name)}
                                alt={row.platform_name}
                                style={{
                                  width: 18,
                                  height: 18,
                                  objectFit: 'contain',
                                  filter:
                                    isDarkMode &&
                                    (row.platform_name?.toLowerCase() === 'twitter' || row.platform_name?.toLowerCase() === 'x')
                                      ? 'brightness(0) invert(1)'
                                      : 'none'
                                }}
                              />
                              <span>{formatPlatformName(row.platform_name).toUpperCase()}</span>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ width: '13%', fontSize: '0.75rem', padding: '8px' }}>{row.source.toUpperCase()}</TableCell>
                          <TableCell sx={{ width: '13%', fontSize: '0.75rem', padding: '8px' }}>{row.status.toUpperCase()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>

              <TablePagination
                component="div"
                count={totalRows}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5, lg: 4.5 }}>
              <PublicationMap filters={filtersApplied} selectedCountry={selectedCountry} onCountrySelect={setSelectedCountry} />
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      {/* Charts */}
      <Grid size={12}>
        <MainCard>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <PublicationChart filters={filtersApplied} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <PlatformDistributionChart filters={filtersApplied} />
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      {/* Usage Heatmap */}
      <Grid size={12}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <UsageHeatmap filters={filtersApplied} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PlatformSuccessRateChart filters={filtersApplied} />
          </Grid>
        </Grid>
      </Grid>
      {/* Platform Success Rate Summary */}
      <Grid size={12}>
        <MainCard>
          <Typography variant="h5" gutterBottom>
            Platform Performance Summary
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Detailed success metrics by platform
          </Typography>
          <PlatformSuccessRateSummary filters={filtersApplied} />
        </MainCard>
      </Grid>
    </Grid>
  );
}
