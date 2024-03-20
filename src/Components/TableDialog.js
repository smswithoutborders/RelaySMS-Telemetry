import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function createData(
  testID,
  senttime,
  smssent,
  smsrecieved,
  published,
  operatordiff,
  pubdiff,
  total
) {
  return {
    testID,
    senttime,
    smssent,
    smsrecieved,
    published,
    operatordiff,
    pubdiff,
    total,
  };
}

const rows = [
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
  createData(
    "Test 001",
    "10:20",
    "10:21",
    "10:21",
    "10:22",
    "0.1",
    "0.1",
    "0.2"
  ),
];

export default function DialogTable() {
  return (
    <TableContainer sx={{ p: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Test ID</TableCell>
            <TableCell>Sent Time</TableCell>
            <TableCell>SMS Sent</TableCell>
            <TableCell>SMS Recieved</TableCell>
            <TableCell>Published</TableCell>
            <TableCell>Operator Difference</TableCell>
            <TableCell>Publisher Difference</TableCell>
            <TableCell>Total Difference</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.testID}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.testID}
              </TableCell>
              <TableCell>{row.senttime}</TableCell>
              <TableCell>{row.smssent}</TableCell>
              <TableCell>{row.smsrecieved} </TableCell>
              <TableCell>{row.published} </TableCell>
              <TableCell>{row.operatordiff} </TableCell>
              <TableCell>{row.pubdiff} </TableCell>
              <TableCell>{row.total} </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
