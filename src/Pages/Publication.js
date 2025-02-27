import React, { useState, useEffect } from "react";
import Navbar from "../Components/Nav";
import {
	Box,
	useTheme,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	CircularProgress,
	Typography,
	Button,
	LinearProgress,
	Grid,
	Skeleton,
	Paper,
	Card,
	CardContent
} from "@mui/material";
import { getName } from "country-list";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomNoRowsOverlay from "../Components/CustomNoRowsOverlay";

const Publication = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const theme = useTheme();
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [platformFilter, setPlatformFilter] = useState("all");
	const [totalRecords, setTotalRecords] = useState(0);
	const [statusFilter, setStatusFilter] = useState("all");
	const [totals, setTotals] = useState({
		total_publications: 0,
		total_published: 0,
		total_failed: 0
	});
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10
	});

	// ======================= Apply filter =======================
	const applyFilters = () => {
		let query = `start_date=2020-01-01&end_date=${today}&page=${paginationModel.page + 1}&page_size=${paginationModel.pageSize}`;

		if (statusFilter !== "all") {
			query += `&status=${statusFilter}`;
		}

		if (platformFilter !== "all") {
			query += `&platform_name=${platformFilter}`;
		}

		console.log("API Request with query:", query);

		fetch(`https://api.telemetry.staging.smswithoutborders.com/v1/publications?${query}`)
			.then((response) => response.json())
			.then((result) => {
				if (result.publications) {
					setFilteredData(result.publications.data);
					setTotalRecords(result.publications.pagination.total_records);
				} else {
					setError("No data found");
				}
			})
			.catch((err) => {
				setError("Failed to fetch data");
				console.error(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	// ========================= Fetch Data =========================
	useEffect(() => {
		const today = dayjs().format("YYYY-MM-DD");
		fetch(
			`https://api.telemetry.staging.smswithoutborders.com/v1/publications?start_date=2020-01-01&end_date=${today}&page=${paginationModel.page + 1}&page_size=${paginationModel.pageSize}`
		)
			.then((response) => response.json())
			.then((result) => {
				if (result.publications) {
					setFilteredData(result.publications.data);
					setTotalRecords(result.publications.pagination.total_records);
					setFilteredData(result.publications.data);
					setTotalRecords(result.publications.pagination.total_records);
					// Set the totals here
					setTotals({
						total_publications: result.publications.total_publications,
						total_published: result.publications.total_published,
						total_failed: result.publications.total_failed
					});
				}
			})
			.catch((err) => {
				setError("Failed to fetch data");
				console.error(err);
			})
			.finally(() => setLoading(false));
	}, [paginationModel]);

	// =========================== Table Columns ============================
	const columns = [
		{ field: "id", headerName: "ID", flex: 1 },
		{
			field: "date_time",
			headerName: "Date & Time",
			flex: 2,
			renderCell: (params) => dayjs(params.value).format("MMMM D, YYYY h:mm A")
		},
		{
			field: "country_code",
			headerName: "Country",
			flex: 1,
			renderCell: (params) => (params.value ? getName(params.value) : "Unknown")
		},
		{ field: "platform_name", headerName: "Platform", flex: 1 },
		{ field: "source", headerName: "Source", flex: 1 },
		{
			field: "status",
			headerName: "Status",
			flex: 1,
			renderCell: (params) => {
				const statusColors = {
					success: "green",
					failed: "red",
					pending: "orange"
				};

				return (
					<Typography
						sx={{ color: statusColors[params.value?.toLowerCase()] || "gray", fontWeight: "bold" }}
					>
						{params.value}
					</Typography>
				);
			}
		},
		{ field: "gateway_client", headerName: "Gateway Client", flex: 1 }
	];

	const today = dayjs().format("YYYY-MM-DD");

	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
				backgroundColor: theme.palette.background.default
			}}
		>
			<Navbar onToggle={setDrawerOpen} />
			<Box
				sx={{
					flexGrow: 1,
					padding: 12,
					marginLeft: drawerOpen ? "250px" : "0px",
					transition: "margin-left 0.3s ease-in-out"
				}}
			>
				{/* Header */}
				<Typography variant="h3">Publication</Typography>
				<Typography variant="h5" color="gray">
					Users with Tokens
				</Typography>

				{/* Totals Section */}
				<Box mt={5} display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
					<Card sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
						<CardContent>
							<Typography variant="h6">Total Publications</Typography>
							<Typography variant="h4">{totals.total_publications}</Typography>
						</CardContent>
					</Card>
					<Card sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
						<CardContent>
							<Typography variant="h6">Total Published</Typography>
							<Typography variant="h4">{totals.total_published}</Typography>
						</CardContent>
					</Card>
					<Card sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
						<CardContent>
							<Typography variant="h6">Total Failed</Typography>
							<Typography variant="h4">{totals.total_failed}</Typography>
						</CardContent>
					</Card>
				</Box>

				{/* Filters Section */}
				<Box mt={5} display="grid" gap={3}>
					{loading ? (
						<Grid container spacing={3}>
							{[...Array(3)].map((_, index) => (
								<Grid item xs={12} sm={6} md={6} lg={4} key={index}>
									<Box height="100%">
										<Paper
											elevation={4}
											sx={{
												p: 3,
												borderRadius: 3,
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												justifyContent: "space-between",
												width: "100%",
												minHeight: 220,
												height: "100%"
											}}
										>
											<Skeleton variant="circular" width={40} height={40} />
											<Skeleton variant="text" width="60%" height={24} sx={{ mt: 2 }} />
											<Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
											<Skeleton variant="rectangular" width="100%" height={8} sx={{ mt: 2 }} />
										</Paper>
									</Box>
								</Grid>
							))}
						</Grid>
					) : error ? (
						<Typography color="error" variant="h6" align="center">
							{error}
						</Typography>
					) : (
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel>Platform</InputLabel>
									<Select
										value={platformFilter}
										onChange={(e) => setPlatformFilter(e.target.value)}
									>
										<MenuItem value="all">All</MenuItem>
										<MenuItem value="gmail">Gmail</MenuItem>
										<MenuItem value="twitter">Twitter</MenuItem>
										<MenuItem value="telegram">Telegram</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel>Status</InputLabel>
									<Select
										value={statusFilter}
										onChange={(e) => setStatusFilter(e.target.value)}
										label="Status"
									>
										<MenuItem value="all">All</MenuItem>
										<MenuItem value="published">Published</MenuItem>
										<MenuItem value="failed">Failed</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} display="flex" justifyContent="center" mt={2}>
								<Button onClick={applyFilters} variant="contained" sx={{ mr: 2 }}>
									Apply
								</Button>
							</Grid>
						</Grid>
					)}
				</Box>

				{/* Data Table */}
				{loading ? (
					<Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
						<CircularProgress />
					</Box>
				) : error ? (
					<Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
						<Typography color="error">{error}</Typography>
					</Box>
				) : (
					<>
						<Box mt={3} display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr" }} gap={2}>
							<DataGrid
								loading={loading}
								rows={filteredData}
								getRowId={(row) => row.id}
								columns={columns}
								pageSize={paginationModel.pageSize}
								pageSizeOptions={[10, 25, 50, 100]}
								paginationModel={paginationModel}
								paginationMode="server"
								rowCount={totalRecords}
								onPaginationModelChange={setPaginationModel}
								sx={{ height: 550 }}
								slots={{
									noRowsOverlay: CustomNoRowsOverlay,
									loadingOverlay: LinearProgress,
									toolbar: GridToolbar
								}}
							/>
						</Box>
					</>
				)}
			</Box>
		</Box>
	);
};

export default Publication;
