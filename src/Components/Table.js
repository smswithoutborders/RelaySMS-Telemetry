import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { FaAngleDown } from "react-icons/fa6";
import { LinearProgress } from "@mui/material";

function createData(msisdn, country, operator, resiliance) {
  return { msisdn, country, operator, resiliance };
}

const rows = [
  createData(+237650393369, "Cameroon", "MTN", "90%"),
  createData(+237650393369, "Cameroon", "MTN", "90%"),
  createData(+237650393369, "Cameroon", "MTN", "90%"),
  createData(+237650393369, "Cameroon", "MTN", "90%"),
  createData(+237650393369, "Cameroon", "MTN", "90%"),
];

export default function TheTable({ handleClickOpen }) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>MSISDN</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Operator</TableCell>
            <TableCell>Resiliance%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
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
                <FaAngleDown onClick={handleClickOpen} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
