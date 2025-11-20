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

const headCells = [
  { id: 'date', align: 'left', label: 'Date' },
  { id: 'users', align: 'right', label: 'Users' }
];

function UserTableHead({ order, orderBy }) {
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
  orderBy: PropTypes.string
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
  const effectiveCategory = filters?.category || 'signup';

  useEffect(() => {
    const countryParam = filters?.countryCode ? `&country_code=${filters.countryCode}` : '';
    const apiUrl = `${import.meta.env.VITE_APP_TELEMETRY_API}${effectiveCategory}?start_date=${effectiveStartDate}&end_date=${effectiveEndDate}&granularity=${granularity}&group_by=date&page=${page + 1}&page_size=${rowsPerPage}${countryParam}`;

    setLoading(true);
    setError('');
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
    // Trigger re-fetch by updating a dependency
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
              <UserTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell align="right">{row.users}</TableCell>
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
