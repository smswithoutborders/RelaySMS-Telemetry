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
import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ReloadOutlined } from '@ant-design/icons';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

countries.registerLocale(enLocale);

const maxValues = {
  totalGatewayClients: 20000
};

const calculatePercentage = (value, max) => {
  return max ? Math.min((value / max) * 100, 100).toFixed(2) : '0.00';
};

const headCells = [
  { id: 'msisdn', align: 'left', label: 'Msisdn' },
  { id: 'country', align: 'left', label: 'Country' },
  { id: 'operator', align: 'left', label: 'Operator' },
  { id: 'operator_code', align: 'left', label: 'Operator code' },
  { id: 'reliability', align: 'left', label: 'Reliability' },
  { id: 'last_published_date', align: 'left', label: 'Date', orderBy: 'last_published_date' }
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

export default function ReliabilityTable() {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('last_published_date');
  const [country, setCountry] = useState('');
  const [operator, setOperator] = useState('');
  const [msisdn, setMsisdn] = useState('');
  const [operatorCode, setOperatorCode] = useState('');
  const [reliability, setReliability] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [period, setPeriod] = useState('day');
  const [metrics, setMetrics] = useState({
    totalGatewayClients: 0,
    percentages: {
      totalGatewayClients: 0
    }
  });
  const [tableData, setTableData] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableOperators, setAvailableOperators] = useState([]);
  const [reliabilityValues, setReliabilityValues] = useState({});
  const [reliabilityLoading, setReliabilityLoading] = useState(false);

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

  const handleApplyFilters = () => {
    const appliedFilters = {
      msisdn,
      country,
      operator,
      operatorCode,
      reliability,
      dateFilter: dateFilter ? dateFilter.format('YYYY-MM-DD') : '2021-01-10'
    };
    setFiltersApplied(appliedFilters);
    setPage(0);
  };

  const handleResetFilters = () => {
    setCountry('');
    setOperator('');
    setDateFilter(null);
    setMsisdn('');
    setOperatorCode('');
    setReliability('');
    setFiltersApplied({});
    setPage(0);
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

  const getPeriodRange = useCallback(() => {
    const now = dayjs();
    switch (period) {
      case 'day':
        return { start: now.startOf('day').unix(), end: now.endOf('day').unix() };
      case 'week':
        return { start: now.startOf('week').unix(), end: now.endOf('week').unix() };
      case 'month':
        return { start: now.startOf('month').unix(), end: now.endOf('month').unix() };
      case 'all':
      default:
        return { start: 0, end: now.unix() };
    }
  }, [period]);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const appliedDate = filtersApplied.dateFilter || '2021-01-10';

        const params = {
          date_filter: appliedDate,
          page: page + 1,
          page_size: rowsPerPage
        };

        if (filtersApplied.country) params.country = filtersApplied.country;
        if (filtersApplied.operator) params.operator = filtersApplied.operator;
        if (filtersApplied.msisdn) params.msisdn = filtersApplied.msisdn;
        if (filtersApplied.operatorCode) params.operator_code = filtersApplied.operatorCode;

        if (filtersApplied.sort_by) params.sort_by = filtersApplied.sort_by;
        if (filtersApplied.sort_order) params.sort_order = filtersApplied.sort_order;

        const response = await axios.get(`${import.meta.env.VITE_APP_GATEWAY_SERVER_URL}clients`, { params });

        const clientsArray = response.data || [];

        const countriesSet = new Set();
        const operatorsSet = new Set();
        clientsArray.forEach((item) => {
          if (item?.country) {
            countriesSet.add(item.country);
          }
          if (item?.operator) {
            operatorsSet.add(item.operator);
          }
        });
        setAvailableCountries(['', ...Array.from(countriesSet).sort()]);
        setAvailableOperators(['', ...Array.from(operatorsSet).sort()]);

        const formatted = Array.isArray(clientsArray)
          ? clientsArray.map((item) => {
              const fullCountryName = item?.country || 'Unknown';
              const rawCode = countries.getAlpha2Code(fullCountryName, 'en')?.toUpperCase() || 'UNKNOWN';
              const flag = countries.isValid(rawCode, 'en') ? countryCodeToEmojiFlag(rawCode) : '';

              return {
                country: fullCountryName,
                flag: flag || '',
                country_code: rawCode,
                msisdn: item.msisdn,
                operator: item.operator,
                operator_code: item.operator_code,
                last_published_date: new Date(item.last_published_date * 1000)
              };
            })
          : [];

        let sortedFormatted = [...formatted];
        if (!params.sort_by) {
          sortedFormatted.sort((a, b) => {
            const isAsc = order === 'asc';
            const valueA = a[orderBy];
            const valueB = b[orderBy];

            if (orderBy === 'last_published_date') {
              return isAsc
                ? a.last_published_date.getTime() - b.last_published_date.getTime()
                : b.last_published_date.getTime() - a.last_published_date.getTime();
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

        setTableData(sortedFormatted);
        setTotalRows(response.data?.pagination?.total_records || clientsArray.length);
        setMetrics({
          totalGatewayClients: response.data?.total_clients || clientsArray.length,
          percentages: {
            totalGatewayClients: calculatePercentage(response.data?.total_clients || clientsArray.length, maxValues.totalGatewayClients)
          }
        });
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Failed to fetch clients. Please try again later.');
        setTableData([]);
        setTotalRows(0);
        setMetrics({
          totalGatewayClients: 0,
          percentages: { totalGatewayClients: 0 }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [filtersApplied, page, rowsPerPage, order, orderBy]);

  useEffect(() => {
    const fetchReliabilitiesForVisibleClients = async () => {
      if (!tableData.length || reliabilityLoading) {
        setReliabilityValues({});
        setReliabilityLoading(false);
        return;
      }

      setReliabilityLoading(true);
      const { start, end } = getPeriodRange();
      const newReliabilityValues = {};

      await Promise.allSettled(
        tableData.map(async (row) => {
          try {
            let pageNum = 1;
            let perPage = 100;
            let allTests = [];
            let hasMore = true;

            while (hasMore) {
              const resp = await axios.get(`${import.meta.env.VITE_APP_GATEWAY_SERVER_URL}clients/${row.msisdn}/tests`, {
                params: {
                  page: pageNum,
                  per_page: perPage
                }
              });
              const tests = resp.data || [];

              if (tests.length > 0) {
                allTests = [...allTests, ...tests];
                pageNum++;
              } else {
                hasMore = false;
              }
            }

            const filteredTests = allTests.filter((t) => t.start_time >= start && t.start_time <= end);

            const totalTests = filteredTests.length;
            const successfulTests = filteredTests.filter((t) => t.status === 'success').length;

            const reliabilityValue = totalTests > 0 ? ((successfulTests / totalTests) * 100).toFixed(2) : '0.00';
            newReliabilityValues[row.msisdn] = reliabilityValue;
          } catch (e) {
            console.error(`Error fetching reliability for ${row.msisdn}:`, e);
            newReliabilityValues[row.msisdn] = 'N/A';
          }
        })
      );

      setReliabilityValues(newReliabilityValues);
      setReliabilityLoading(false);
    };

    fetchReliabilitiesForVisibleClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData, period, getPeriodRange]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5">Open Telemetry</Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <AnalyticEcommerce
          title="Gateway Clients"
          count={metrics.totalGatewayClients.toLocaleString()}
          percentage={metrics.percentages.totalGatewayClients}
          extra="Total number of listed Gateway Clients"
        />
      </Grid>

      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MainCard sx={{ mt: 1 }} content={false}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Filters
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select sx={{ height: 53 }} value={country} onChange={(e) => setCountry(e.target.value)} label="Country">
                      <MenuItem value="">All</MenuItem>
                      {availableCountries.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Operator</InputLabel>
                    <Select sx={{ height: 53 }} value={operator} onChange={(e) => setOperator(e.target.value)} label="Operator">
                      <MenuItem value="">All</MenuItem>
                      {availableOperators.map((o) => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Reliability Period</InputLabel>
                    <Select sx={{ height: 53 }} value={period} onChange={(e) => setPeriod(e.target.value)} label="Reliability Period">
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="week">Week</MenuItem>
                      <MenuItem value="month">Month</MenuItem>
                      <MenuItem value="all">All</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <Button sx={{ height: 53 }} fullWidth variant="contained" onClick={handleApplyFilters}>
                    Apply
                  </Button>
                </Grid>

                <Grid item xs={6} sm={3} md={3}>
                  <Button sx={{ height: 53 }} fullWidth variant="outlined" startIcon={<ReloadOutlined />} onClick={handleResetFilters}>
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </MainCard>
        </LocalizationProvider>
      </Grid>

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
                  {tableData.map((row) => {
                    const currentReliability = reliabilityValues[row.msisdn];
                    return (
                      <TableRow key={row.msisdn} hover style={{ cursor: 'pointer' }}>
                        <TableCell>
                          <Link to={`/tests/${row.msisdn}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {row.msisdn}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span style={{ marginRight: 8 }}>{row.flag}</span>
                          {row.country ? row.country : 'No Country'}
                        </TableCell>
                        <TableCell>{row.operator}</TableCell>
                        <TableCell>{row.operator_code}</TableCell>
                        <TableCell>
                          {reliabilityLoading ? (
                            <CircularProgress size={16} />
                          ) : currentReliability !== undefined ? (
                            `${currentReliability}%`
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>{row.last_published_date.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
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
