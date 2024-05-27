import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
	Grid,
	Box,
	Card,
	Typography,
	LinearProgress,
	CircularProgress,
	Button
} from "@mui/material";
import CountrySearch from "../Components/CountrySearch";
import OperatorSearch from "../Components/OperatorSearch";
import CustomNoRowsOverlay from "../Components/CustomNoRowsOverlay";
import DateSearch from "../Components/DateSearch";
import { useNavigate } from "react-router-dom";

const gs_url = process.env.REACT_APP_GATEWAY_SERVER_URL;
const apiUrl = `${gs_url}/v3/clients`;
const drawerWidth = 240;

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

const Reliability = () => {
	const navigate = useNavigate();
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

	const handleRowClick = useCallback(
		(params) => {
			const msisdn = params.row.msisdn;
			navigate("/tests", { state: { msisdn: msisdn } });
		},
		[navigate]
	);

	const getProgressColor = (value) => {
		return value >= 75 ? "success" : value >= 50 ? "warning" : "error";
	};

	const renderReliabilityCell = (params) => {
		const value = parseFloat(params.value).toFixed(2);
		const color = getProgressColor(value);

		return (
			<Box sx={{ position: "relative", display: "inline-flex" }}>
				<CircularProgress
					variant="determinate"
					value={100}
					size={49}
					thickness={1}
					sx={{ color: "grey" }}
				/>
				<CircularProgress
					variant="determinate"
					value={value}
					size={49}
					thickness={1}
					color={color}
					sx={{ position: "absolute", left: 0 }}
				/>
				<Box
					sx={{
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						position: "absolute",
						display: "flex",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<Typography fontSize={9} variant="caption">{`${value}%`}</Typography>
				</Box>
			</Box>
		);
	};

	const columns = [
		{ field: "msisdn", headerName: "MSISDN", minWidth: 180, flex: 1 },
		{ field: "country", headerName: "Country", minWidth: 100, flex: 0.7 },
		{ field: "operator", headerName: "Operator", minWidth: 100, flex: 0.7 },
		{ field: "operator_code", headerName: "Operator Code", minWidth: 100, flex: 0.6 },
		{
			field: "reliability",
			headerName: "Reliability",
			minWidth: 100,
			flex: 0.6,
			renderCell: renderReliabilityCell
		},
		{
			field: "last_published_date",
			headerName: "Date/Time",
			minWidth: 180,
			flex: 1,
			valueFormatter: (params) => formatDate(params.value)
		}
	];

	return (
		<Box
			className="bg"
			component="main"
			sx={{
				px: { md: 3, sm: 3, xs: 2 },
				pb: { md: 3, sm: 3, xs: 14 },
				flexGrow: 1
			}}
		>
			<Grid container sx={{ p: 2 }} justifyContent="center" alignItems="center" direction="row">
				<Grid
					item
					lg={2}
					md={3}
					xs={0}
					sm={3}
					sx={{
						display: { xs: "none", sm: "none", md: "block" },
						"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
					}}
				></Grid>
				<Grid
					mx="auto"
					item
					lg={10}
					md={9}
					xs={12}
					sm={12}
					sx={{
						p: { md: 3, sm: 2, xs: 0 },
						width: { sm: `calc(100% - ${drawerWidth}px)`, md: `calc(100% - ${drawerWidth}px)` }
					}}
				>
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
						<Grid item md={3} xs={6}>
							<Button variant="contained" onClick={handleRefresh} disabled={clientDataLoading}>
								Refresh {clientDataLoading && <CircularProgress size={24} />}
							</Button>
						</Grid>
					</Grid>
					<DataGrid
						loading={clientDataLoading}
						rows={data}
						getRowId={(row) => row.msisdn}
						onRowClick={handleRowClick}
						rowCount={totalRows}
						columns={columns}
						pageSizeOptions={[10, 25, 50, 100]}
						paginationModel={paginationModel}
						paginationMode="server"
						onPaginationModelChange={setPaginationModel}
						slots={{
							noRowsOverlay: CustomNoRowsOverlay,
							loadingOverlay: LinearProgress
						}}
						sx={{ height: 550 }}
					/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Reliability;
