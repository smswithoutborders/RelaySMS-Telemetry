// (imports same as before)
import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Typography,
  TablePagination,
  Button,
  Stack,
  Paper
} from '@mui/material';
import axios from 'axios';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

function CountryTableHead({ order, orderBy, userLabel }) {
  const headCells = useMemo(
    () => [
      { id: 'date', align: 'left', label: 'Country' },
      { id: 'users', align: 'right', label: userLabel }
    ],
    [userLabel]
  );
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} sortDirection={orderBy === headCell.id ? order : false}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

CountryTableHead.propTypes = {
  order: PropTypes.any,
  orderBy: PropTypes.string,
  userLabel: PropTypes.string.isRequired
};

export default function CountryTable({ filters }) {
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [order] = useState('asc');
  const [orderBy] = useState('country');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const today = new Date();
  const effectiveStartDate = filters?.startDate || '2020-01-10';
  const effectiveEndDate = filters?.endDate || today.toISOString().split('T')[0];
  const effectiveGranularity = filters?.granularity || 'day';
  const effectiveCategory = filters?.category || 'signup';

  const userLabel = effectiveCategory === 'signup' ? 'Signed Up Users' : 'Active Users';

  const countryCodeToEmojiFlag = (code) => {
    if (!code) return '';
    return code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
  };

  useEffect(() => {
    const fetchCountryData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_TELEMETRY_API}${effectiveCategory}?start_date=${effectiveStartDate}&end_date=${effectiveEndDate}&granularity=${effectiveGranularity}&group_by=country&page=${page + 1}&page_size=${rowsPerPage}`
        );

        const categoryKey = effectiveCategory.includes('retained') ? 'retained' : 'signup';
        const countryStats = response.data[categoryKey]?.data || [];

        const formatted = countryStats.map((item) => {
          const rawCode = item?.country_code;
          const code = typeof rawCode === 'string' ? rawCode.toUpperCase() : undefined;
          const isValidCode = code && countries.isValid(code, 'en');
          const name = isValidCode ? countries.getName(code, 'en') : 'Unknown';
          const flag = isValidCode ? countryCodeToEmojiFlag(code) : '';

          const count = item.signup_users ?? item.retained_users ?? 0;

          return {
            country: name || code || 'Unknown',
            users: count,
            flag: flag || ''
          };
        });

        setCountryData(formatted);
        setTotalRows(response.data[categoryKey]?.pagination?.total_records || 0);
        setError('');
      } catch (err) {
        console.error('Error fetching country data:', err);
        setError('Failed to load country data');
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [filters, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box component={Paper}>
        <TableContainer sx={{ minHeight: 495, maxHeight: 495 }}>
          {loading && (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          )}

          {!loading && error && (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {!loading && !error && (
            <Table>
              <CountryTableHead order={order} orderBy={orderBy} userLabel={userLabel} />
              <TableBody>
                {countryData.length > 0 ? (
                  countryData.map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <span style={{ marginRight: 8 }}>{row.flag}</span>
                        {row.country}
                      </TableCell>
                      <TableCell align="right">{row.users}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
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
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </>
  );
}

CountryTable.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    groupBy: PropTypes.string,
    granularity: PropTypes.string,
    setGranularity: PropTypes.func,
    category: PropTypes.string
  })
};
