import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  TablePagination,
  Stack,
  Paper
} from '@mui/material';
import { Button } from 'antd';
import dayjs from 'dayjs';

import Loader from 'components/Loader';
import ErrorDisplay from 'components/ErrorDisplay';
import { fontSize } from '@mui/system';

function UserTableHead({ order, orderBy, category }) {
  const headCells =
    category === 'all'
      ? [
          { id: 'date', align: 'left', label: 'Date' },
          { id: 'signupUsers', align: 'right', label: 'Sign-up Users' },
          { id: 'currentUsers', align: 'right', label: 'Current Users' }
        ]
      : [
          { id: 'date', align: 'left', label: 'Date' },
          { id: 'users', align: 'right', label: category === 'signup' ? 'Sign-up Users' : 'Users' }
        ];

  return (
    <TableHead sx={{ backgroundColor: 'background.default', position: 'sticky', top: 0, zIndex: 1 }}>
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

UserTableHead.propTypes = {
  order: PropTypes.any,
  orderBy: PropTypes.string,
  category: PropTypes.string.isRequired
};

export default function UserTable({ filters }) {
  const [data, setData] = useState([]);
  const [order] = useState('asc');
  const [orderBy] = useState('date');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [granularity, setGranularity] = useState('month');

  const today = new Date();
  const defaultEndDate = today.toISOString().split('T')[0];
  const defaultStartDate = '2021-01-10';
  const effectiveStartDate = filters?.startDate || defaultStartDate;
  const effectiveEndDate = filters?.endDate || defaultEndDate;
  const groupBy = filters?.groupBy || 'date';
  const effectiveCategory = filters?.category || 'all';

  useEffect(() => {
    setPage(0);
  }, [effectiveStartDate, effectiveEndDate, effectiveCategory, filters?.countryCode]);

  useEffect(() => {
    const countryParam = filters?.countryCode ? `&country_code=${filters.countryCode}` : '';

    setLoading(true);
    setError('');

    if (effectiveCategory === 'all') {
      Promise.all([
        fetch(
          `${import.meta.env.VITE_APP_TELEMETRY_API}signup?start_date=${effectiveStartDate}&end_date=${effectiveEndDate}&granularity=${granularity}&group_by=date&page=${page + 1}&page_size=${rowsPerPage}${countryParam}`
        ),
        fetch(
          `${import.meta.env.VITE_APP_TELEMETRY_API}retained?start_date=${effectiveStartDate}&end_date=${effectiveEndDate}&granularity=${granularity}&group_by=date&page=${page + 1}&page_size=${rowsPerPage}${countryParam}`
        )
      ])
        .then(([signupRes, retainedRes]) => Promise.all([signupRes.json(), retainedRes.json()]))
        .then(([signupResponse, retainedResponse]) => {
          const signupData = signupResponse.signup?.data || [];
          const retainedData = retainedResponse.retained?.data || [];

          const dateMap = new Map();

          signupData.forEach((item) => {
            dateMap.set(item.timeframe, {
              date: item.timeframe,
              signupUsers: item.signup_users || 0,
              retainedUsers: 0
            });
          });

          retainedData.forEach((item) => {
            const existing = dateMap.get(item.timeframe) || {
              date: item.timeframe,
              signupUsers: 0,
              retainedUsers: 0
            };
            existing.retainedUsers = item.retained_users || 0;
            dateMap.set(item.timeframe, existing);
          });

          const formattedData = Array.from(dateMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));

          setData(formattedData);
          setTotalRows(
            Math.max(signupResponse.signup?.pagination?.total_records || 0, retainedResponse.retained?.pagination?.total_records || 0)
          );
        })
        .catch((err) => {
          console.error(err);
          setError('Unable to load data');
        })
        .finally(() => setLoading(false));
    } else {
      const apiUrl = `${import.meta.env.VITE_APP_TELEMETRY_API}${effectiveCategory}?start_date=${effectiveStartDate}&end_date=${effectiveEndDate}&granularity=${granularity}&group_by=date&page=${page + 1}&page_size=${rowsPerPage}${countryParam}`;

      fetch(apiUrl)
        .then((res) => res.json())
        .then((response) => {
          const categoryData = response[effectiveCategory]?.data || [];
          const formattedData = categoryData.map((item) => ({
            date: item.timeframe,
            users: item[`${effectiveCategory}_users`] || item.users || 0
          }));

          setData(formattedData);
          setTotalRows(response[effectiveCategory]?.pagination?.total_records || 0);
        })
        .catch((err) => {
          console.error(err);
          setError('Unable to load data');
        })
        .finally(() => setLoading(false));
    }
  }, [
    filters?.startDate,
    filters?.endDate,
    filters?.countryCode,
    groupBy,
    effectiveCategory,
    page,
    rowsPerPage,
    granularity,
    effectiveStartDate,
    effectiveEndDate
  ]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRetry = () => {
    setError('');
    setLoading(true);
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (granularity === 'month') {
      return dayjs(dateString).format('MMMM YYYY');
    }
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <Button
          style={{ fontSize: '0.7rem' }}
          size="small"
          onClick={() => setGranularity('month')}
          color={granularity === 'month' ? 'primary' : 'secondary'}
          variant={granularity === 'month' ? 'dashed' : 'text'}
        >
          Month
        </Button>
        <Button
          style={{ fontSize: '0.7rem' }}
          size="small"
          onClick={() => setGranularity('day')}
          color={granularity === 'day' ? 'primary' : 'secondary'}
          variant={granularity === 'day' ? 'dashed' : 'text'}
        >
          Day
        </Button>
      </Stack>

      <Box component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <TableContainer sx={{ minHeight: 500, maxHeight: 510 }}>
          {loading && (
            <Box display="flex" justifyContent="center" p={4}>
              <Loader size={50} fullScreen={false} />
            </Box>
          )}

          {!loading && error && <ErrorDisplay onRetry={handleRetry} />}

          {!loading && !error && (
            <Table aria-labelledby="tableTitle">
              <UserTableHead order={order} orderBy={orderBy} category={effectiveCategory} />
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    {effectiveCategory === 'all' ? (
                      <>
                        <TableCell align="right">{row.signupUsers}</TableCell>
                        <TableCell align="right">{row.retainedUsers}</TableCell>
                      </>
                    ) : (
                      <TableCell align="right">{row.users}</TableCell>
                    )}
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
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </>
  );
}

UserTable.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    groupBy: PropTypes.string,
    setGranularity: PropTypes.func,
    category: PropTypes.string,
    countryCode: PropTypes.string
  })
};
