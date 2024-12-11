import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Card
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";

const DataTable = ({ data, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => (
	<Card
		sx={{
			flex: "1 1 calc(33.33% - 16px)",
			display: "flex",
			flexDirection: "column",
			borderRadius: 2,
			boxShadow: 3
		}}
	>
		<Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
			Month Available
		</Typography>
		<TableContainer>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0" }}>
							Month
						</TableCell>
						<TableCell sx={{ fontWeight: "bold", textAlign: "center", backgroundColor: "#e0e0e0" }}>
							Available
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.month}>
							<TableCell>{row.month}</TableCell>
							<TableCell>{row.available}</TableCell>
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
			onPageChange={onPageChange}
			onRowsPerPageChange={onRowsPerPageChange}
		/>
	</Card>
);

export default DataTable;
