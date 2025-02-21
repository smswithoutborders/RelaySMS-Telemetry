import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
	Grid,
	Box,
	Card,
	Typography,
	LinearProgress,
	CircularProgress,
	Button,
	Stack
} from "@mui/material";
import CountrySearch from "../Components/CountrySearch";
import OperatorSearch from "../Components/OperatorSearch";
import CustomNoRowsOverlay from "../Components/CustomNoRowsOverlay";
import DateSearch from "../Components/DateSearch";
import Navbar from "../Components/Nav";

const gs_url = process.env.REACT_APP_GATEWAY_SERVER_URL;
const apiUrl = `${gs_url}/v3/clients`;

const formatDate = (dateString) =>
	!dateString ? "" : new Date(dateString * 1000).toLocaleString();

const useFetchData = (url) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setData(data);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, loading };
};

const useClientData = (paginationModel, selectedCountry, selectedOperator, selectedDate) => {
	const [data, setData] = useState([]);
	const [totalRows, setTotalRows] = useState(0);
	const [loading, setLoading] = useState(false);

	const fetchClientData = async () => {
		setLoading(true);
		try {
			const url = new URL(apiUrl);
			const params = {
				page: paginationModel.page + 1,
				per_page: paginationModel.pageSize,
				...(selectedCountry && { country: selectedCountry.toLowerCase() }),
				...(selectedOperator && { operator: selectedOperator.toLowerCase() }),
				...(selectedDate && { last_published_date: selectedDate })
			};
			url.search = new URLSearchParams(params).toString();

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const totalCount = parseInt(response.headers.get("X-Total-Count"));
			const data = await response.json();
			setData(data);
			setTotalRows(totalCount);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchClientData();
	}, [paginationModel, selectedCountry, selectedOperator, selectedDate]);

	return { data, totalRows, loading, refetch: fetchClientData };
};

const Resilience = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedOperator, setSelectedOperator] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
	const { data: countryData, loading: countryLoading } = useFetchData(`${apiUrl}/countries`);
	const { data: operatorData, loading: operatorLoading } = useFetchData(
		`${apiUrl}/${selectedCountry}/operators`
	);

	const {
		data,
		totalRows,
		loading: clientDataLoading,
		refetch
	} = useClientData(paginationModel, selectedCountry, selectedOperator, selectedDate);

	const handleRefresh = () => {
		refetch();
	};

	const handleCountrySelect = (country) => {
		setSelectedCountry(country);
		setSelectedOperator(null);
	};

	const columns = [
		{ field: "msisdn", headerName: "MSISDN", minWidth: 100, flex: 1 },
		{ field: "country", headerName: "Country", minWidth: 100, flex: 0.7 },
		{ field: "operator", headerName: "Operator", minWidth: 100, flex: 0.7 },
		{ field: "operator_code", headerName: "Operator Code", minWidth: 100, flex: 0.6 },
		{ field: "protocols", headerName: "Protocols", minWidth: 100, flex: 0.6 },
		{
			field: "last_published_date",
			headerName: "Date/Time",
			minWidth: 100,
			flex: 1,
			valueFormatter: (params) => formatDate(params.value)
		}
	];

	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh"
			}}
		>
			<Navbar onToggle={setDrawerOpen} />
			<Box
				sx={{
					flexGrow: 1,
					padding: 3,
					marginLeft: drawerOpen ? "250px" : "0px",
					transition: "margin-left 0.3s ease-in-out"
				}}
			>
				<Box sx={{ flexGrow: 1, padding: 3 }}>
					<Box
						className="hero"
						sx={{
							p: 2,
							mb: 3,
							boxShadow: "5px 5px 0 rgba(0, 0, 0, 0.1)",
							borderRadius: "8px",
							position: "relative",
							minHeight: "250px"
						}}
					>
						<Box sx={{ flexGrow: 1, padding: 3 }}>
							{/* =================================================== */}

							<Grid
								container
								columnSpacing={4}
								rowSpacing={4}
								alignItems="flex-end"
								sx={{ py: { md: 5, sm: 5, xs: 1 }, pt: { md: 3, xs: 2, sm: 2 } }}
							>
								<Grid item md={3} xs={6}>
									<Card sx={{ p: 2 }}>
										<Typography textAlign="center" variant="h3" sx={{ fontWeight: 600 }}>
											{totalRows}
										</Typography>
										<Typography
											textAlign="center"
											variant="body1"
											sx={{ fontWeight: 500, p: 1, fontSize: { md: 14, sm: 14, xs: 12 } }}
										>
											Total Gateway Clients
										</Typography>
									</Card>
								</Grid>
								<Grid item md={3} xs={6}>
									<CountrySearch
										countries={countryData}
										onSelectCountry={handleCountrySelect}
										loading={countryLoading}
									/>
									{selectedCountry && (
										<OperatorSearch
											operators={operatorData}
											onSelectOperator={setSelectedOperator}
											loading={operatorLoading}
										/>
									)}
								</Grid>
								<Grid item md={3} xs={6}>
									<DateSearch onSelectDate={setSelectedDate} />
								</Grid>
							</Grid>
							<Stack
								spacing={1}
								direction="row"
								alignItems="center"
								sx={{ mb: 1 }}
								useFlexGap
								flexWrap="wrap"
							>
								<Button variant="outlined" onClick={handleRefresh} disabled={clientDataLoading}>
									Refetch data {clientDataLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
								</Button>
							</Stack>
							<DataGrid
								loading={clientDataLoading}
								rows={data}
								getRowId={(row) => row.msisdn}
								rowCount={totalRows}
								columns={columns}
								pageSizeOptions={[10, 25, 50, 100]}
								paginationModel={paginationModel}
								paginationMode="server"
								onPaginationModelChange={setPaginationModel}
								slots={{
									noRowsOverlay: CustomNoRowsOverlay,
									loadingOverlay: LinearProgress,
									toolbar: GridToolbar
								}}
								sx={{ height: 550 }}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Resilience;
