import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FaAngleDown } from "react-icons/fa6";
import { Box, LinearProgress, TablePagination } from "@mui/material";
import FreeSolo from "./SearchInput";
import { Link } from "react-router-dom";

function createData(msisdn, country, operator, resiliance) {
  return { msisdn, country, operator, resiliance };
}

function generateRandomPhoneNumber() {
  const countryCode = "+237";
  const randomNumber = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, "0");
  return countryCode + randomNumber;
}

const rows = [
  createData(generateRandomPhoneNumber(), "Cameroon", "Orange", "90%"),
  createData(generateRandomPhoneNumber(), "Ghana", "Camtel", "90%"),
  createData(generateRandomPhoneNumber(), "Argentina", "Camtel", "90%"),
  createData(generateRandomPhoneNumber(), "Brazil", "T-Mobile", "90%"),
  createData(generateRandomPhoneNumber(), "France", "Airtel", "90%"),
  createData(generateRandomPhoneNumber(), "Germany", "MTN", "90%"),
  createData(generateRandomPhoneNumber(), "India", "MTN", "90%"),
  createData(generateRandomPhoneNumber(), "Italy", "MTN", "90%"),
  createData(generateRandomPhoneNumber(), "Japan", "Etisalat", "90%"),
  createData(generateRandomPhoneNumber(), "Mexico", "Orange", "90%"),
  createData(generateRandomPhoneNumber(), "Nigeria", "MTN", "90%"),
  createData(generateRandomPhoneNumber(), "Peru", "Camtel", "90%"),
  createData(generateRandomPhoneNumber(), "Russia", "Airtel", "90%"),
  createData(generateRandomPhoneNumber(), "Spain", "Airtel", "90%"),
  createData(generateRandomPhoneNumber(), "Turkey", "MTN", "90%"),
  createData(generateRandomPhoneNumber(), "Ukraine", "MTN", "90%"),
  createData(generateRandomPhoneNumber(), "United Kingdom", "Orange", "90%"),
  createData(generateRandomPhoneNumber(), "United States", "Orange", "90%"),
  createData(generateRandomPhoneNumber(), "Vietnam", "MTN", "90%"),
  createData(generateRandomPhoneNumber(), "Zambia", "MTN", "90%"),
  createData(generateRandomPhoneNumber(), "Zimbabwe", "Glo", "90%"),
  createData(generateRandomPhoneNumber(), "Australia", "MTN", "90%"),
];

export default function TheTable({ handleClickOpen }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = Math.max(0, page * rowsPerPage - rows.length + rowsPerPage);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableCell>
            <FreeSolo />
          </TableCell>
          <TableCell>
            <FreeSolo />
          </TableCell>
          <TableCell>
            <FreeSolo />
          </TableCell>
          <TableCell>
            <FreeSolo />
          </TableCell>
        </TableHead>
        <TableHead className="stickyHeader">
          <TableRow>
            <TableCell>MSISDN</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Operator</TableCell>
            <TableCell>Resiliance%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow
              key={row.msisdn}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.msisdn}
              </TableCell>
              <TableCell>{row.country}</TableCell>
              <TableCell>{row.operator}</TableCell>
              <TableCell>
                {row.resiliance}{" "}
                <LinearProgress variant="determinate" value={90} />
              </TableCell>
              <TableCell>
                <Link
                  to="/data"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <Box>
                    <FaAngleDown />
                  </Box>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 23 * emptyRows }}>
              <TableCell colSpan={4} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
