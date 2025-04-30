// TestDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LeftOutlined } from '@ant-design/icons';
import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';

const StyledTableRow = styled(TableRow)(({ theme, status }) => ({
  ...(status === 'success' && {
    backgroundColor: '#E9FBEB',
    '&:hover': {
      backgroundColor: theme.palette.success.main
    }
  }),
  ...(status === 'timedout' && {
    backgroundColor: '#FFE5E5',
    '&:hover': {
      backgroundColor: theme.palette.error.main
    }
  }),
  ...(status === 'pending' && {
    backgroundColor: theme.palette.warning.light,
    '&:hover': {
      backgroundColor: theme.palette.warning.main
    }
  })
}));

function TestDetails() {
  const { msisdn } = useParams();
  const [allTestData, setAllTestData] = useState([]);
  const [filteredTestData, setFilteredTestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_GATEWAY_SERVER_URL}clients/${msisdn}/tests`);
        setAllTestData(response.data);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setError('Failed to fetch test data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [msisdn]);

  useEffect(() => {
    let filtered = [...allTestData];

    if (statusFilter) {
      filtered = filtered.filter((test) => test.status === statusFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filterDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((test) => {
        const testDate = new Date(test.start_time * 1000);
        testDate.setHours(0, 0, 0, 0);
        return testDate.getTime() === filterDate.getTime();
      });
    }

    setFilteredTestData(filtered);
    setPage(0);
  }, [allTestData, statusFilter, dateFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const visibleRows = filteredTestData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Tests for MSISDN: {msisdn}
      </Typography>
      <Button component={Link} to="/reliability" variant="text" sx={{ mb: 2 }}>
        <LeftOutlined /> Back
      </Button>

      {/* Filters */}
      <Grid size={{ xs: 12 }}>
        <MainCard sx={{ mt: 1 }} content={false}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, md: 6, lg: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select labelId="status-filter-label" id="status-filter" value={statusFilter} onChange={handleStatusFilterChange}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="timedout">Timedout</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* New Operator Filter */}
              <Grid item size={{ xs: 12, md: 6, lg: 3 }}>
                <TextField
                  id="date-filter"
                  label="Filter by Date"
                  type="date"
                  value={dateFilter}
                  onChange={handleDateFilterChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
        {filteredTestData.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>sms_received_time</TableCell>
                  <TableCell>sms_routed_time</TableCell>
                  <TableCell>sms_sent_time</TableCell>
                  <TableCell>start_time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((test) => (
                  <StyledTableRow key={test.id} status={test.status}>
                    <TableCell>{test.id}</TableCell>
                    <TableCell>{new Date(test.sms_received_time * 1000).toLocaleString()}</TableCell>
                    <TableCell>{new Date(test.sms_routed_time * 1000).toLocaleString()}</TableCell>
                    <TableCell>{new Date(test.sms_sent_time * 1000).toLocaleString()}</TableCell>
                    <TableCell>{new Date(test.start_time * 1000).toLocaleString()}</TableCell>
                    <TableCell>{test.status}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTestData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        ) : (
          <Typography>No tests found matching your criteria.</Typography>
        )}
      </Grid>
    </div>
  );
}

export default TestDetails;
