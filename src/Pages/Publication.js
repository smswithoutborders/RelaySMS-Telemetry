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
	Paper
} from "@mui/material";
import { getName } from "country-list";
import dayjs from "dayjs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomNoRowsOverlay from "../Components/CustomNoRowsOverlay";
import { MailOutline, CheckCircle, Error, ErrorOutline } from "@mui/icons-material";

const Publication = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const theme = useTheme();
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [platformFilter, setPlatformFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const isDarkMode = theme.palette.mode === "dark";
	const [totals, setTotals] = useState({
		total_publications: 0,
		total_published: 0,
		total_failed: 0
	});
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 100
	});
	const [totalRecords, setTotalRecords] = useState(0);

	// ====================================== Apply filter ======================================

	const applyFilters = () => {
		let query = `start_date=2020-01-01&end_date=${today}&page=${paginationModel.page + 1}&page_size=${paginationModel.pageSize}`;

		if (statusFilter !== "all") {
			query += `&status=${statusFilter}`;
		}

		if (platformFilter !== "all") {
			query += `&platform_name=${platformFilter}`;
		}

		console.log("API Request with query:", query);

		setLoading(true);

		fetch(`https://api.telemetry.smswithoutborders.com/v1/publications?${query}`)
			.then((response) => response.json())
			.then((result) => {
				if (result.publications) {
					const filteredData = result.publications.data;
					setFilteredData(filteredData);
					setTotalRecords(result.publications.pagination.total_records);

					setTotals({
						total_publications: filteredData.length,
						total_published: filteredData.filter((item) => item.status === "published").length,
						total_failed: filteredData.filter((item) => item.status === "failed").length
					});
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

	// =================================== Fetch Data ==================================
	useEffect(() => {
		const today = dayjs().format("YYYY-MM-DD");
		fetch(
			`https://api.telemetry.smswithoutborders.com/v1/publications?start_date=2020-01-01&end_date=${today}&page=${paginationModel.page + 1}&page_size=${paginationModel.pageSize}`
		)
			.then((response) => response.json())
			.then((result) => {
				if (result.publications) {
					setFilteredData(result.publications.data);
					setTotalRecords(result.publications.pagination.total_records);
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

	// =========================== Reset Filters ============================
	const resetFilters = () => {
		setPlatformFilter("all");
		setStatusFilter("all");
		setPaginationModel({ page: 0, pageSize: 10 });

		setTotals({
			total_publications: 0,
			total_published: 0,
			total_failed: 0
		});
		setFilteredData([]);
		setError(null);
		setLoading(true);

		const today = dayjs().format("YYYY-MM-DD");
		fetch(
			`https://api.telemetry.smswithoutborders.com/v1/publications?start_date=2020-01-01&end_date=${today}&page=1&page_size=10`
		)
			.then((response) => response.json())
			.then((result) => {
				if (result.publications) {
					setFilteredData(result.publications.data);
					setTotalRecords(result.publications.pagination.total_records);
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
	};

	// =========================== Table Columns ============================
	const columns = [
		{
			field: "id",
			headerName: "ID",
			flex: 1,
			headerClassName: "custom-header",
			cellClassName: "custom-cell"
		},
		{
			field: "date_created",
			headerName: "Date & Time",
			flex: 2,
			headerClassName: "custom-header",
			cellClassName: "custom-cell",
			renderCell: (params) => dayjs(params.value).format("MMMM D, YYYY h:mm A")
		},
		{
			field: "country_code",
			headerName: "Country",
			flex: 1,
			headerClassName: "custom-header",
			cellClassName: "custom-cell",
			renderCell: (params) => (params.value ? getName(params.value) : "Unknown")
		},
		{
			field: "platform_name",
			headerName: "Platform",
			flex: 1,
			headerClassName: "custom-header",
			cellClassName: "custom-cell"
		},
		{
			field: "source",
			headerName: "Source",
			flex: 1,
			headerClassName: "custom-header",
			cellClassName: "custom-cell"
		},
		{
			field: "status",
			headerName: "Status",
			flex: 1,
			headerClassName: "custom-header",
			cellClassName: (params) => `status-${params.value?.toLowerCase() || "default"}`,
			renderCell: (params) => {
				const statusColors = {
					published: "#28a745",
					failed: "#dc3545",
					pending: "#ffc107"
				};

				return (
					<Typography
						sx={{
							color: statusColors[params.value?.toLowerCase()] || "#6c757d",
							fontWeight: "bold",
							textTransform: "capitalize"
						}}
					>
						{params.value}
					</Typography>
				);
			}
		},
		{
			field: "gateway_client",
			headerName: "Gateway Client",
			flex: 1,
			headerClassName: "custom-header",
			cellClassName: "custom-cell"
		}
	];

	const today = dayjs().format("YYYY-MM-DD");

	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
				backgroundColor: theme.palette.background.default,
				overflowX: "hidden",
				width: "100vw"
			}}
		>
			<Navbar onToggle={setDrawerOpen} />

			<Box
				sx={{
					flexGrow: 1,
					padding: { xs: 2, sm: 4, md: 8, lg: 12 },
					marginLeft: { xs: "0px", sm: drawerOpen ? "250px" : "0px" },
					transition: "margin-left 0.3s ease-in-out"
				}}
			>
				{/* Header */}
				<Box
					sx={{
						textAlign: "start",
						mb: 2,
						p: 2,
						borderRadius: 3
					}}
				>
					<Typography
						variant="h3"
						sx={{
							fontWeight: "bold",
							letterSpacing: "1px",
							textShadow:
								theme.palette.mode === "dark"
									? "0 3px 6px rgba(255, 255, 255, 0.3)"
									: "0 3px 6px rgba(0, 0, 0, 0.3)",
							maxWidth: "100%",
							wordWrap: "break-word",
							mt: 4
						}}
					>
						📢 Publication
					</Typography>

					<Typography
						variant="h6"
						sx={{
							fontSize: "1.2rem",
							mt: 1,
							opacity: 0.9,
							color: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
							maxWidth: "100%"
						}}
					>
						Message Tracker for RelaySMS
					</Typography>
				</Box>
				{/*=============================== Totals Section=========================== */}
				<Box gap={3}>
					{loading ? (
						<Grid container spacing={2} sx={{ p: 3 }}>
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
						<Grid container spacing={2} sx={{ p: 3 }}>
							{[
								{
									title: "Total Messages Sent",
									value: totals.total_publications,
									icon: <MailOutline fontSize="large" />,
									color: "#000158",
									description: "Total Number of Messages Sent",
									max: 5000
								},
								{
									title: "Published Messages",
									value: totals.total_published,
									icon: <CheckCircle fontSize="large" />,
									color: "#000158",
									description: "Number of Successfully Published Messages",
									max: 5000
								},
								{
									title: "Failed Messages",
									value: totals.total_failed,
									icon: <Error fontSize="large" />,
									color: "#000158",
									description: "Number of Messages that Failed",
									max: 5000
								}
							].map((item, index) => {
								const percentage =
									item.value && item.max ? Math.min((item.value / item.max) * 100, 100) : 0;

								const theme = useTheme();

								return (
									<Grid item xs={12} sm={6} md={6} lg={4} key={index}>
										<Box height="100%">
											<Paper
												elevation={6}
												sx={{
													p: 3,
													borderRadius: 3,
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "space-between",
													width: "80%",
													minHeight: 220,
													height: "90%",
													bgcolor: theme.palette.mode === "dark" ? "#424242" : "#f4f6f8",
													boxShadow:
														theme.palette.mode === "dark"
															? "0 6px 20px rgba(255, 255, 255, 0.1)"
															: "0 6px 20px rgba(40, 5, 122, 0.12)",
													transition: "transform 0.3s ease, box-shadow 0.3s ease",
													"&:hover": {
														transform: "translateY(-5px)",
														boxShadow:
															theme.palette.mode === "dark"
																? "0 12px 30px rgba(255, 255, 255, 0.2)"
																: "0 12px 30px rgba(3, 15, 75, 0.15)"
													}
												}}
											>
												<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
													{/* Title */}
													<Typography
														variant="body2"
														sx={{
															color: isDarkMode ? "white" : "#000158",
															opacity: 0.8,
															fontSize: "1rem",
															mr: 3,
															fontWeight: "bold"
														}}
													>
														{item.title}
													</Typography>

													{/* Icon */}
													<Typography
														variant="h5"
														sx={{
															color: isDarkMode ? "white" : "#000158",
															fontSize: "3rem"
														}}
													>
														{item.icon}
													</Typography>
												</Box>

												{/* Value and Percentage */}
												<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
													{/* Value */}
													<Typography
														variant="h5"
														sx={{
															fontWeight: "bold",
															color: theme.palette.mode === "dark" ? "white" : item.color,
															fontSize: "3rem",
															textShadow: "0 0 15px rgba(9, 95, 66, 0.5)"
														}}
													>
														{item.value}
													</Typography>

													{/* Percentage */}
													<Typography
														variant="body2"
														sx={{
															color: theme.palette.mode === "dark" ? "white" : item.color,
															opacity: 0.8,
															fontSize: "1rem",
															ml: 1
														}}
													>
														({percentage.toFixed(1)}%)
													</Typography>
												</Box>

												{/* Description */}
												<Typography
													variant="body2"
													sx={{
														color: theme.palette.mode === "dark" ? "white" : "gray",
														textAlign: "center",
														mt: 1
													}}
												>
													{item.description}
												</Typography>
											</Paper>
										</Box>
									</Grid>
								);
							})}
						</Grid>
					)}
				</Box>
				{/* ==================================Filters Section====================================== */}
				<Grid container spacing={4} sx={{ p: 4 }}>
					{/* Platform Filter */}
					<Grid item xs={12} sm={6}>
						<FormControl
							fullWidth
							sx={{
								backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#424242" : "#F3F4F6"),
								borderRadius: "12px",
								boxShadow: (theme) =>
									theme.palette.mode === "dark"
										? "0 8px 15px rgba(0, 0, 0, 0.3)"
										: "0 8px 15px rgba(0, 0, 0, 0.1)"
							}}
						>
							<InputLabel
								sx={{ color: theme.palette.mode === "dark" ? "rgb(192, 216, 236)" : "#000158" }}
							>
								Platforms
							</InputLabel>
							<Select
								value={platformFilter}
								label="Platforms"
								onChange={(e) => setPlatformFilter(e.target.value)}
								sx={{
									background: "transparent",
									borderRadius: "10px",
									borderColor: "#4B6EFD",
									transition: "all 0.3s ease",
									"& .MuiSelect-icon": {
										color: "#4B6EFD"
									},
									"& .MuiOutlinedInput-root": {
										padding: "10px 15px",
										"&:hover": {
											borderColor: "#3C5DFF"
										}
									},
									"& .MuiMenuItem-root": {
										padding: "10px 15px"
									}
								}}
							>
								<MenuItem value="all">All</MenuItem>
								<MenuItem value="gmail">Gmail</MenuItem>
								<MenuItem value="twitter">Twitter</MenuItem>
								<MenuItem value="telegram">Telegram</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* Status Filter */}
					<Grid item xs={12} sm={6}>
						<FormControl
							fullWidth
							sx={{
								backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#424242" : "#F3F4F6"),
								borderRadius: "12px",
								boxShadow: (theme) =>
									theme.palette.mode === "dark"
										? "0 8px 15px rgba(0, 0, 0, 0.3)"
										: "0 8px 15px rgba(0, 0, 0, 0.1)"
							}}
						>
							<InputLabel
								sx={{ color: theme.palette.mode === "dark" ? "rgb(192, 216, 236)" : "#000158" }}
							>
								Status
							</InputLabel>
							<Select
								value={statusFilter}
								label="Status"
								onChange={(e) => setStatusFilter(e.target.value)}
								sx={{
									background: "transparent",
									borderRadius: "10px",
									borderColor: "#FF9A00",
									transition: "all 0.3s ease",
									"& .MuiSelect-icon": {
										color: "#FF9A00"
									},
									"& .MuiOutlinedInput-root": {
										padding: "10px 15px",
										"&:hover": {
											borderColor: "#FF7D00"
										}
									},
									"& .MuiMenuItem-root": {
										padding: "10px 15px"
									}
								}}
							>
								<MenuItem value="all">All</MenuItem>
								<MenuItem value="published">Published</MenuItem>
								<MenuItem value="failed">Failed</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					{/* Action Buttons */}
					<Grid item xs={12} display="flex" justifyContent="center" mt={3}>
						<Button
							onClick={applyFilters}
							variant="contained"
							sx={{
								background: (theme) =>
									theme.palette.mode === "dark" ? "0 10px 30px  #2196F3" : "#000158",
								color: "white",
								borderRadius: "30px",
								padding: "12px 40px",
								fontWeight: "bold",
								boxShadow: (theme) =>
									theme.palette.mode === "dark"
										? "0 8px 25px rgba(0, 0, 0, 0.3)"
										: "0 8px 25px rgba(0, 0, 0, 0.1)",
								textTransform: "none",
								transition: "all 0.3s ease",
								"&:hover": {
									background: "#2196F3",
									transform: "scale(1.05)",
									boxShadow: (theme) =>
										theme.palette.mode === "dark"
											? "0 10px 30px rgba(0, 0, 0, 0.15)"
											: "0 10px 30px rgba(0, 0, 0, 0.2)"
								},
								"&:active": {
									transform: "scale(0.98)"
								}
							}}
						>
							Apply
						</Button>

						<Button
							onClick={resetFilters}
							variant="outlined"
							color="secondary"
							sx={{
								borderColor: "#B85900",
								color: "#B85900",
								borderRadius: "30px",
								padding: "12px 40px",
								fontWeight: "bold",
								marginLeft: "20px",
								textTransform: "none",
								"&:hover": {
									borderColor: "#51525C",
									color: "#FF7D00",
									transform: "scale(1.05)"
								},
								"&:active": {
									transform: "scale(0.98)"
								}
							}}
						>
							Reset
						</Button>
					</Grid>
				</Grid>
				{/*================================= Data Table================================ */}
				{loading ? (
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						minHeight="50vh"
						sx={{
							background: (theme) =>
								theme.palette.mode === "dark"
									? "linear-gradient(45deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4))"
									: "linear-gradient(45deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))",
							borderRadius: "15px",
							padding: "30px",
							boxShadow: (theme) =>
								theme.palette.mode === "dark"
									? "0 4px 15px rgba(0, 0, 0, 0.3)"
									: "0 4px 15px rgba(0, 0, 0, 0.1)"
						}}
					>
						<CircularProgress size={80} sx={{ color: "#4B6EFD", animationDuration: "1.5s" }} />
					</Box>
				) : error ? (
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						minHeight="50vh"
						sx={{
							background: (theme) =>
								theme.palette.mode === "dark"
									? "linear-gradient(45deg, rgba(255, 0, 0, 0.3), rgba(255, 0, 0, 0.5))"
									: "linear-gradient(45deg, rgba(255, 0, 0, 0.1), rgba(255, 0, 0, 0.3))",
							borderRadius: "15px",
							padding: "30px",
							boxShadow: (theme) =>
								theme.palette.mode === "dark"
									? "0 4px 15px rgba(0, 0, 0, 0.3)"
									: "0 4px 15px rgba(0, 0, 0, 0.1)"
						}}
					>
						<Typography variant="h6" color="error" sx={{ fontWeight: "bold", textAlign: "center" }}>
							<ErrorOutline sx={{ mr: 1 }} /> {error}
						</Typography>
					</Box>
				) : (
					<>
						<Box mt={3} display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr" }} gap={3}>
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
								sx={{
									height: 550,
									borderRadius: "15px",
									boxShadow: (theme) =>
										theme.palette.mode === "dark"
											? "0 4px 15px rgba(255, 255, 255, 0.1)"
											: "0 4px 15px rgba(0, 0, 0, 0.1)",
									background: (theme) => (theme.palette.mode === "dark" ? "#424242" : "#FFFFFF"),
									"& .MuiDataGrid-root": {
										borderRadius: "15px",
										boxShadow: "none"
									},
									"& .MuiDataGrid-cell": {
										transition: "all 0.3s ease",
										"&:hover": {
											backgroundColor:
												theme.palette.mode === "dark"
													? "rgba(255, 255, 255, 0.1)"
													: "rgba(0, 0, 0, 0.05)"
										}
									}
								}}
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