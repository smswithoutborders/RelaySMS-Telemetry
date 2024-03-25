import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid } from "@mui/material";
import FreeSolo from "../Components/SearchInput";
import { FaChevronLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

function createData(
  id,
  testid,
  senttime,
  smssent,
  smsrecieved,
  published,
  operatordiff,
  publisherdiff,
  totaldiff
) {
  return {
    id,
    testid,
    senttime,
    smssent,
    smsrecieved,
    published,
    operatordiff,
    publisherdiff,
    totaldiff,
  };
}

const rows = [
  createData(
    1,
    "Test 001",
    "10:20",
    "10:21",
    "10:22",
    "10:23",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    2,
    "Test 002",
    "10:24",
    "10:25",
    "10:26",
    "10:27",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    3,
    "Test 003",
    "10:28",
    "10:29",
    "10:30",
    "10:31",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    4,
    "Test 004",
    "10:32",
    "10:33",
    "10:34",
    "10:35",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    5,
    "Test 005",
    "10:36",
    "10:37",
    "10:38",
    "10:39",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    6,
    "Test 006",
    "10:40",
    "10:41",
    "10:42",
    "10:43",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    7,
    "Test 007",
    "10:44",
    "10:45",
    "10:46",
    "10:47",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    8,
    "Test 008",
    "10:48",
    "10:49",
    "10:50",
    "10:51",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    9,
    "Test 009",
    "10:52",
    "10:53",
    "10:54",
    "10:55",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    10,
    "Test 010",
    "10:56",
    "10:57",
    "10:58",
    "10:59",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    11,
    "Test 011",
    "11:00",
    "11:01",
    "11:02",
    "11:03",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    12,
    "Test 012",
    "11:04",
    "11:05",
    "11:06",
    "11:07",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    13,
    "Test 013",
    "11:08",
    "11:09",
    "11:10",
    "11:11",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    14,
    "Test 014",
    "11:12",
    "11:13",
    "11:14",
    "11:15",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    15,
    "Test 015",
    "11:16",
    "11:17",
    "11:18",
    "11:19",
    "0.1",
    "0.1",
    "0.2"
  ),
];

const columns = [
  { field: "testid", headerName: "Test ID", width: 120 },
  {
    field: "senttime",
    headerName: "Sent Time",
    width: 120,
  },
  { field: "smssent", headerName: "SMS Sent", width: 120 },
  { field: "smsrecieved", headerName: "SMS Recieved", width: 120 },
  { field: "published", headerName: "Published", width: 120 },
  { field: "operatordiff", headerName: "Operator Difference", width: 120 },
  { field: "publisherdiff", headerName: "Publisher Difference", width: 120 },
  { field: "totaldiff", headerName: "Total Difference", width: 120 },
];

export default function TheTable() {
  return (
    <Grid container sx={{ p: { md: 10, xs: 3 } }}>
      <Grid item md={2}></Grid>
      <Grid item md={9} xs={12} sx={{ mt: { xs: 6, md: 0 } }}>
        <Link to="/">
          <FaChevronLeft /> Back
        </Link>
        <Box sx={{ pb: 4 }}>
          <Grid container columnSpacing={4} rowSpacing={4} sx={{ py: 5 }}>
            <Grid item md={3} xs={6}>
              <FreeSolo />
            </Grid>
            <Grid item md={3} xs={6}>
              <FreeSolo />
            </Grid>
            <Grid item md={3} xs={6}>
              <FreeSolo />
            </Grid>
            <Grid item md={3} xs={6}>
              <Button
                sx={{ p: 1 }}
                autoFocus
                color="success"
                variant="contained"
              >
                Download Data
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            pagination
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
