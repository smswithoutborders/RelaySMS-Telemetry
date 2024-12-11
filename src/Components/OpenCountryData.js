import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Card,
	TablePagination
} from "@mui/material";

const CountryDataTable = ({ data }) => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<Card sx={{ borderRadius: 2, boxShadow: 3, padding: 2 }}>
			<Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
				Country User
			</Typography>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell
								sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0" }}
							>
								Country
							</TableCell>
							<TableCell
								sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0" }}
							>
								Users
							</TableCell>
							<TableCell
								sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0" }}
							>
								Percentage
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((row) => (
							<TableRow key={row.country}>
								<TableCell sx={{ textAlign: "center" }}>{row.country}</TableCell>
								<TableCell sx={{ textAlign: "center" }}>{row.users}</TableCell>
								<TableCell sx={{ textAlign: "center" }}>{row.percentage}%</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handlePageChange}
				onRowsPerPageChange={handleRowsPerPageChange}
			/>
		</Card>
	);
};

export default CountryDataTable;
