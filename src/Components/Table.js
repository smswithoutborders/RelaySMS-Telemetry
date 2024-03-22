import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import { FaChevronDown } from "react-icons/fa6";

const countryCodes = {
  Cameroon: "CM",
  Ghana: "GH",
  Argentina: "AR",
  Brazil: "BR",
  France: "FR",
  Germany: "DE",
  India: "IN",
  Italy: "IT",
  Japan: "JP",
  Mexico: "MX",
  Nigeria: "NG",
  Peru: "PE",
  Russia: "RU",
  Spain: "ES",
  Turkey: "TR",
  Ukraine: "UA",
  "United Kingdom": "GB",
  "United States": "US",
  Vietnam: "VN",
  Zambia: "ZM",
  Zimbabwe: "ZW",
  Australia: "AU",
};

function getCountryCode(countryName) {
  return countryCodes[countryName];
}

function createData(id, msisdn, country, operator, resiliance) {
  return { id, msisdn, country, operator, resiliance };
}

function generateRandomPhoneNumber() {
  const countryCode = "+237";
  const randomNumber = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, "0");
  return countryCode + randomNumber;
}

const rows = [
  createData(1, generateRandomPhoneNumber(), "Cameroon", "Orange", "90%"),
  createData(2, generateRandomPhoneNumber(), "Ghana", "Camtel", "60%"),
  createData(3, generateRandomPhoneNumber(), "Argentina", "Camtel", "80%"),
  createData(4, generateRandomPhoneNumber(), "Brazil", "T-Mobile", "95%"),
  createData(5, generateRandomPhoneNumber(), "France", "Airtel", "68%"),
  createData(6, generateRandomPhoneNumber(), "Germany", "MTN", "96%"),
  createData(7, generateRandomPhoneNumber(), "India", "MTN", "57%"),
  createData(8, generateRandomPhoneNumber(), "Italy", "MTN", "50%"),
  createData(9, generateRandomPhoneNumber(), "Japan", "Etisalat", "50%"),
  createData(10, generateRandomPhoneNumber(), "Mexico", "Orange", "90%"),
  createData(11, generateRandomPhoneNumber(), "Nigeria", "MTN", "49%"),
  createData(12, generateRandomPhoneNumber(), "Peru", "Camtel", "10%"),
  createData(13, generateRandomPhoneNumber(), "Russia", "Airtel", "90%"),
  createData(14, generateRandomPhoneNumber(), "Spain", "Airtel", "80%"),
  createData(15, generateRandomPhoneNumber(), "Turkey", "MTN", "60%"),
  createData(16, generateRandomPhoneNumber(), "Ukraine", "MTN", "99%"),
  createData(
    17,
    generateRandomPhoneNumber(),
    "United Kingdom",
    "Orange",
    "90%"
  ),
  createData(18, generateRandomPhoneNumber(), "United States", "Orange", "90%"),
  createData(19, generateRandomPhoneNumber(), "Vietnam", "MTN", "90%"),
  createData(20, generateRandomPhoneNumber(), "Zambia", "MTN", "90%"),
  createData(21, generateRandomPhoneNumber(), "Zimbabwe", "Glo", "90%"),
  createData(22, generateRandomPhoneNumber(), "Australia", "MTN", "90%"),
];

const columns = [
  { field: "msisdn", headerName: "MSISDN", width: 200 },
  {
    field: "country",
    headerName: "Country",
    width: 200,
    renderCell: (params) => (
      <React.Fragment>
        {params.value && (
          <ReactCountryFlag countryCode={getCountryCode(params.value)} svg />
        )}
        {params.value}
      </React.Fragment>
    ),
  },
  { field: "operator", headerName: "Operator", width: 200 },
  { field: "resiliance", headerName: "Resiliance%", width: 200 },
  {
    field: "action",
    headerName: "",
    width: 100,
    renderCell: (params) => (
      <Link to="/data">
        <IconButton>
          <FaChevronDown />
        </IconButton>
      </Link>
    ),
  },
];

export default function TheTable() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        pagination
        pageSizeOptions={[5, 10, 25]}
      />
    </div>
  );
}
