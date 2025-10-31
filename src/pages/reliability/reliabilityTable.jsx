// material-ui
import TableSortLabel from '@mui/material/TableSortLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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

// antd
import { Button, Select, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
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
      dateFilter: dateFilter ? dayjs(dateFilter).format('YYYY-MM-DD') : '2021-01-10'
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
      const startISO = new Date(start * 1000).toISOString();
      const endISO = new Date(end * 1000).toISOString();

      const newReliabilityValues = {};

      await Promise.allSettled(
        tableData.map(async (row) => {
          try {
            const params = {
              start_time: startISO,
              end_time: endISO
            };

            const resp = await axios.get(`${import.meta.env.VITE_APP_GATEWAY_SERVER_URL}clients/${row.msisdn}/tests`, {
              params
            });
            const data = resp.data || {};
            const totalTests = data.total_records || 0;
            const successfulTests = data.total_success || 0;
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
          // percentage={metrics.percentages.totalGatewayClients}
          extra="Total number of listed Gateway Clients"
        />
      </Grid>

      <Grid item xs={12}>
        <Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Space wrap size="middle">
            <Select
              placeholder="Country"
              value={country || undefined}
              onChange={(value) => setCountry(value || '')}
              style={{ width: 150 }}
              allowClear
              options={availableCountries.filter((c) => c !== '').map((c) => ({ value: c, label: c }))}
            />

            <Select
              placeholder="Operator"
              value={operator || undefined}
              onChange={(value) => setOperator(value || '')}
              style={{ width: 150 }}
              allowClear
              options={availableOperators.filter((o) => o !== '').map((o) => ({ value: o, label: o }))}
            />

            <Select
              placeholder="Reliability Period"
              value={period}
              onChange={(value) => setPeriod(value)}
              style={{ width: 150 }}
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'all', label: 'All' }
              ]}
            />

            <Button type="primary" onClick={handleApplyFilters}>
              Apply
            </Button>

            <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
              Reset
            </Button>
          </Space>
        </Box>
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
