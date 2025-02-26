import React, { useState, useEffect } from "react";
import Navbar from "../Components/Nav";
import {
	Box,
	useTheme,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Card,
	CardContent,
	CircularProgress,
	Typography,
	Button,
	LinearProgress,
	Grid,
	Skeleton,
	Paper
} from "@mui/material";
import { getName } from "country-list";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomNoRowsOverlay from "../Components/CustomNoRowsOverlay";
import { PersonAdd, People, Group } from "@mui/icons-material";

const Publication = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const theme = useTheme();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filteredData, setFilteredData] = useState([]);
	const [platformFilter, setPlatformFilter] = useState("all");
	const [countryFilter, setCountryFilter] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 10
	});
	const [totalRecords, setTotalRecords] = useState(0);

	// ======================= Apply filter =======================
	const applyFilters = () => {
		if (data?.publications?.data) {
			let filtered = data.publications.data;

			if (platformFilter !== "all") {
				filtered = filtered.filter((item) => item.platform_name.toLowerCase() === platformFilter);
			}

			if (countryFilter) {
				filtered = filtered.filter(
					(item) =>
						item.country_code && item.country_code.toLowerCase() === countryFilter.toLowerCase()
				);
			}

			if (startDate && endDate) {
				filtered = filtered.filter((item) => {
					const itemDate = dayjs(item.date_time);
					return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
				});
			}

			setFilteredData(filtered);
		}
	};

	const resetFilters = () => {
		setPlatformFilter("all");
		setCountryFilter("");
		setStartDate("");
		setEndDate("");
		setFilteredData(data?.publications?.data || []);
	};

	// ================================
	const fetchPublicationsData = async () => {
		try {
			const { page, pageSize } = paginationModel;
			const today = dayjs().format("YYYY-MM-DD");
			const response = await fetch(
				`https://api.telemetry.staging.smswithoutborders.com/v1/publications?start_date=2020-01-01&end_date=${today}&country_code&page=${page + 1}&page_size=${pageSize}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}
			const result = await response.json();
			setData(result);
			setFilteredData(result.publications.data);
			setTotalRecords(result.publications.pagination.total_records);
		} catch (err) {
			setError("Failed to fetch data");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPublicationsData();
	}, [paginationModel]);

	// ===========================  table columns ==============================
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
				<Box mt={3}>
					<Typography variant="h3">Publication</Typography>
					<Typography variant="h5" color="gray">
						Users with Tokens
					</Typography>
				</Box>

				{/* ?=========================================================================================== */}
				<Grid container spacing={3}>
					{loading ? (
						<Grid container spacing={3} sx={{ p: 3 }}>
							{[...Array(3)].map((_, index) => (
								<Grid item xs={12} sm={6} md={4} lg={2} key={index}>
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
						<Grid container sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: "white" }} spacing={3}>
							{[
								{
									title: "Active Users",
									value: 0,
									icon: <Group fontSize="large" />,
									color: "#2196F3",
									description: "Total Number of Messages Sent",
									max: 5000
								},
								{
									title: "Published publications ",
									value: 0,
									icon: <PersonAdd fontSize="large" />,
									color: "#000158",
									description: "Number successfully publiched messages ",
									max: 5000
								},
								{
									title: "Failed publications ",
									value: 0,
									icon: <People fontSize="large" />,
									color: "#B85900",
									description: "Number of messages that failed",
									max: 5000
								}
							].map((item, index) => {
								const percentage =
									item.value && item.max ? Math.min((item.value / item.max) * 100, 100) : 0;

								return (
									<Grid item xs={12} sm={6} md={4} lg={2} key={index}>
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
													bgcolor: "#f9f9f9",
													textAlign: "center",
													boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
													width: "100%",
													minHeight: 220,
													height: "100%"
												}}
											>
												<Typography variant="h6" sx={{ fontWeight: "bold" }}>
													<Typography sx={{ color: item.color }}>{item.icon}</Typography>{" "}
													{item.title}
												</Typography>

												<Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
													{item.value}
												</Typography>
												<Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
													({percentage.toFixed(1)}%)
												</Typography>

												<Typography variant="body2" sx={{ color: "gray" }}>
													{item.description}
												</Typography>
											</Paper>
										</Box>
									</Grid>
								);
							})}
						</Grid>
					)}
				</Grid>

				{/* ============================================================================= */}

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
						<Box mt={3} display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr" }} gap={3}>
							<Card sx={{ p: 3 }}>
								<CardContent>
									<Grid container spacing={3} justifyContent="center">
										{/* Platform & Country Code */}
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
										{/* ================================================ */}
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
										{/* ============================================= */}

										{/* Action Buttons */}
										<Grid item xs={12} display="flex" justifyContent="center" mt={2}>
											<Button onClick={applyFilters} variant="contained" sx={{ mr: 2 }}>
												Apply
											</Button>
											<Button onClick={resetFilters} variant="outlined">
												Reset
											</Button>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Box>

						{/* ===================== Table section================== */}
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
