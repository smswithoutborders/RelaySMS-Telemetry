// TestDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Select, DatePicker, Space } from 'antd';
import { styled } from '@mui/material/styles';
import MainCard from 'components/MainCard';

// components
import Loader from 'components/Loader';
import dayjs from 'dayjs';

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
    const fetchAllTests = async () => {
      setLoading(true);
      setError(null);
      let page = 1;
      const perPage = 100;
      let allData = [];
      let hasMore = true;

      try {
        while (hasMore) {
          const response = await axios.get(
            `${import.meta.env.VITE_APP_GATEWAY_SERVER_URL}clients/${msisdn}/tests?page=${page}&per_page=${perPage}`
          );

          const currentData = response.data.data;
          if (currentData.length > 0) {
            allData = [...allData, ...currentData];
            page++;
          } else {
            hasMore = false;
          }
        }

        setAllTestData(allData);
      } catch (err) {
        console.error('Error fetching tests:', err);
        setError('Failed to fetch test data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllTests();
  }, [msisdn]);

  useEffect(() => {
    let filtered = [...allTestData];

    if (statusFilter) {
      filtered = filtered.filter((test) => test.status === statusFilter);
    }

    if (dateFilter) {
      const filterDate = dayjs(dateFilter).startOf('day');
      filtered = filtered.filter((test) => {
        const testDate = dayjs(test.start_time * 1000).startOf('day');
        return testDate.isSame(filterDate);
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

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value || '');
  };

  const handleDateFilterChange = (date) => {
    setDateFilter(date);
  };

  const visibleRows = filteredTestData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Loader size={50} fullScreen={false} />
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

  const formatEpoch = (epoch) => (epoch ? new Date(epoch * 1000).toLocaleString() : 'N/A');

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Tests for MSISDN: {msisdn}
      </Typography>
      <Link to="/reliability" style={{ textDecoration: 'none' }}>
        <Button type="link" icon={<LeftOutlined />} style={{ marginBottom: 16, paddingLeft: 0 }}>
          Back
        </Button>
      </Link>

      {/* Filters */}
      <Grid size={{ xs: 12 }}>
        <Box>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Filters
          </Typography>
          <Space wrap size="middle">
            <Select
              placeholder="Status"
              value={statusFilter || undefined}
              onChange={handleStatusFilterChange}
              style={{ width: 150 }}
              allowClear
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'success', label: 'Success' },
                { value: 'timedout', label: 'Timedout' }
              ]}
            />

            <DatePicker
              placeholder="Filter by Date"
              value={dateFilter ? dayjs(dateFilter) : null}
              onChange={handleDateFilterChange}
              format="YYYY-MM-DD"
            />
          </Space>
        </Box>
      </Grid>

      <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
        {filteredTestData.length > 0 ? (
          <MainCard>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>start_time</TableCell>
                    <TableCell>sms_received_time</TableCell>
                    <TableCell>sms_routed_time</TableCell>
                    <TableCell>sms_sent_time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{test.id}</TableCell>
                      <TableCell>{formatEpoch(test.start_time)}</TableCell>
                      <TableCell>{formatEpoch(test.sms_received_time)}</TableCell>
                      <TableCell>{formatEpoch(test.sms_routed_time)}</TableCell>
                      <TableCell>{formatEpoch(test.sms_sent_time)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor:
                                test.status === 'success'
                                  ? '#52C41A'
                                  : test.status === 'timedout'
                                    ? '#FF4D4F'
                                    : test.status === 'pending'
                                      ? '#FAAD14'
                                      : 'grey',
                              mr: 1
                            }}
                          />
                          {test.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
                component="div"
                count={filteredTestData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </MainCard>
        ) : (
          <Typography>No tests found matching your criteria.</Typography>
        )}
      </Grid>
    </div>
  );
}

export default TestDetails;
