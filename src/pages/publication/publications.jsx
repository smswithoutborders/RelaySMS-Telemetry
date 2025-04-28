// material-ui
import Button from '@mui/material/Button';
import TableSortLabel from '@mui/material/TableSortLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ReloadOutlined } from '@ant-design/icons';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
countries.registerLocale(enLocale);

const maxValues = {
  totalPublication: 50000,
  totalPublished: 30000,
  totalFailed: 20000
};

const calculatePercentage = (value, max) => {
  return max ? Math.min((value / max) * 100, 100).toFixed(2) : '0.00';
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
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sortDirection={orderBy === headCell.id ? order : false}>
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
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
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
    }
  });
  const [tableData, setTableData] = useState([]);

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
      startDate: startDate ? startDate.format('YYYY-MM-DD') : '2021-01-10',
      endDate: endDate ? endDate.format('YYYY-MM-DD') : today,
      status,
      source
    };
    setFiltersApplied(appliedFilters);
  };

  const handleResetFilters = () => {
    setPlatform('');
    setStatus('');
    setSource('');
    setStartDate(null);
    setEndDate(null);
    setFiltersApplied({});
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

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const appliedStart = startDate ? startDate.format('YYYY-MM-DD') : '2021-01-10';
        const appliedEnd = endDate ? endDate.format('YYYY-MM-DD') : today;

        const params = {
          start_date: appliedStart,
          end_date: appliedEnd,
          page: page + 1,
          page_size: rowsPerPage
        };

        if (platform) params.platform_name = platform;
        if (status) params.status = status;
        if (source) params.source = source;

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

        setMetrics({
          totalPublication: response.data.publications?.total_publications || 0,
          totalPublished: response.data.publications?.total_published || 0,
          totalFailed: response.data.publications?.total_failed || 0,
          percentages: {
            totalPublication: calculatePercentage(response.data.publications?.total_publications, maxValues.totalPublication),
            totalPublished: calculatePercentage(response.data.publications?.total_published, maxValues.totalPublished),
            totalFailed: calculatePercentage(response.data.publications?.total_failed, maxValues.totalFailed)
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
  }, [filtersApplied, page, rowsPerPage, order, orderBy]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5">Open Telemetry</Typography>
      </Grid>

      {/* Metrics */}
      <Grid item xs={12} sm={6} md={2}>
        <AnalyticEcommerce
          title="Publications"
          count={metrics.totalPublication.toLocaleString()}
          percentage={metrics.percentages.totalPublication}
          extra="All Publications"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <AnalyticEcommerce
          title="Published"
          count={metrics.totalPublished.toLocaleString()}
          percentage={metrics.percentages.totalPublished}
          extra="Successful Publications"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <AnalyticEcommerce
          title="Failed"
          count={metrics.totalFailed.toLocaleString()}
          percentage={metrics.percentages.totalFailed}
          extra="Failed Publications"
        />
      </Grid>

      {/* Filters */}
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MainCard sx={{ mt: 1 }} content={false}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Filters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Platform</InputLabel>
                    <Select value={platform} onChange={(e) => setPlatform(e.target.value)} label="Platform">
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="gmail">Gmail</MenuItem>
                      <MenuItem value="twitter">Twitter</MenuItem>
                      <MenuItem value="telegram">Telegram</MenuItem>
                      <MenuItem value="email_bridge">Email Bridge</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="published">Published</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Source</InputLabel>
                    <Select value={source} onChange={(e) => setSource(e.target.value)} label="Source">
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="platforms">Platform</MenuItem>
                      <MenuItem value="bridges">Bridge</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker label="Start Date" value={startDate} onChange={(newValue) => setStartDate(newValue)} fullWidth />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker label="End Date" value={endDate} onChange={(newValue) => setEndDate(newValue)} fullWidth />
                </Grid>

                <Grid item xs={6} sm={6} md={2}>
                  <Button fullWidth variant="contained" onClick={handleApplyFilters}>
                    Apply
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={2}>
                  <Button fullWidth variant="outlined" startIcon={<ReloadOutlined />} onClick={handleResetFilters}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </MainCard>
        </LocalizationProvider>
      </Grid>

      {/* Table */}
      <Grid item xs={12}>
        <Paper>
          <TableContainer sx={{ minHeight: 400, maxHeight: 400 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
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
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{new Date(row.date_created).toLocaleString()}</TableCell>
                      <TableCell>
                        <span style={{ marginRight: 8 }}>{row.flag}</span>
                        {row.country ? row.country : 'No Country'}
                      </TableCell>
                      <TableCell>{row.platform_name}</TableCell>
                      <TableCell>{row.source}</TableCell>
                      <TableCell>{row.status}</TableCell>
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
        </Paper>
      </Grid>
    </Grid>
  );
}
