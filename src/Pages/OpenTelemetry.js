import React from "react";
import "../index.css";
import "../Components/OPentelematryjsfile";

const OpenTelemetry = () => {
	return (
		<div>
			<section className="home-section">
				<div className="home-content">
					<i className="bx bx-menu text-light"></i>
					<div className="main">
						<div className="row">
							<div className="col-md-6">
								<h4 className="text-light">Open Telemetry</h4>
								{/* Original content and components */}
								<div className="row">
									{/* Replace with original content */}
									<div className="col-md-6">
										{/* Original content */}
										<p className="text-light">Original content here...</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="home-section">
				<div className="home-content">
					<i className="bx bx-menu text-light"></i>
					<div className="main" id="">
						<div className="row">
							<div className="col-md-6">
								<h4 className="text-light">
									{" "}
									Open Telemetry{" "}
									<i
										className="fa-solid fa-arrows-rotate refresh"
										onClick={() => window.location.reload()}
									></i>
								</h4>
							</div>
							<div className="col-md-6 text-end pe-5"></div>
						</div>

						<div className="row text-light">
							<div className="col-sm-2 card1 text-center m-1">
								<div className="row justify-content-md-center">
									<div className="col-md-3 icondiv">
										<div className="icon1">
											<i className="fa-solid fa-chart-simple fa-2x"></i>
										</div>
									</div>
									<div className="col-md-6">
										<h3 className="total text-light" id="total">
											0
										</h3>
										<p className="text-light textsmall" id="totalheader">
											TOTAL
										</p>
									</div>
								</div>
							</div>

							<div className="col-sm-2 card2 text-center m-1" id="card2">
								<div className="row justify-content-md-center">
									<div className="col-md-3">
										<div className="icon2">
											<i className="fa-solid fa-map-location-dot fa-2x"></i>
										</div>
									</div>
									<div className="col-md-6" id="countrytotaldiv">
										<h3 className="total text-light" id="countrytotal">
											0
										</h3>
										<p className="text-light textsmall">COUNTRY TOTAL</p>
									</div>
								</div>
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-md-3 type">
								<h6 className="text-light">Type</h6>
								<select id="type" className="btn btn-outline-light mb-4 w-75">
									<option value="signup">Signed-up Users</option>
									<option value="available">Available Users</option>
								</select>
							</div>

							<div className="col-md-2 p-3">
								<h6 className="text-light">Format</h6>
								<div className="row">
									<div className="col-md-6">
										<input
											className="form-check-input"
											type="radio"
											name="format"
											value="month"
											id="format_month"
										/>
										<label className="form-check-label text-light"> Month </label>
									</div>
									<div className="col-md-6">
										<input
											className="form-check-input"
											type="radio"
											name="format"
											value="day"
											id="format_day"
										/>
										<label className="form-check-label text-light"> Days</label>
									</div>
								</div>
							</div>

							<div className="col-md-3 text-light ps-1 pe-5 pb-3">
								<div className="row">
									<div className="col-6">
										<small>Start-Date</small>
										<input
											id="start_date"
											type="date"
											className="btn btn-outline-light form-control text-center"
										/>
									</div>
									<div className="col-6">
										<small>End-Date</small>
										<input
											id="end_date"
											type="date"
											className="btn btn-outline-light form-control text-center"
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="row" id="maprow">
							<div className="col-md-7 bigbox2 m-1" id="bigbox2">
								<div className="mapouter" id="mapping">
									<div className="d-flex justify-content-center">
										<div
											className="spinner-border text-light"
											style={{ marginTop: "5rem", width: "4rem", height: "4rem" }}
											role="status"
										>
											<span className="visually-hidden">Loading...</span>
										</div>
									</div>
								</div>
							</div>

							<div className="col-md-4 smallbox2 m-1" id="smallbox2">
								<div className="table-responsive rest" id="countrytableid">
									<table className="table text-center">
										<thead id="countrytable_head" className="text-light"></thead>
										<tbody id="countrytable_data" className="text-light"></tbody>
									</table>
								</div>
							</div>
						</div>

						<div className="row">
							<div className="col-md-7 bigbox m-1">
								<div className="text-light mb-3" id="line_div">
									<div className="d-flex justify-content-center">
										<div
											className="spinner-border text-light"
											style={{ marginTop: "1rem", width: "4rem", height: "4rem" }}
											role="status"
										>
											<span className="visually-hidden">Loading...</span>
										</div>
									</div>
								</div>
							</div>

							<div className="col-md-4 smallbox m-1">
								<div className="d-flex align-items-start">
									<div
										className="nav flex-column nav-pills me-3"
										id="v-pills-tab"
										role="tablist"
										aria-orientation="vertical"
									></div>
									<div className="tab-content w-100" id="v-pills-tabContent"></div>
								</div>
							</div>
						</div>
						<p className="p-3 footer" style={{ color: "rgb(126, 128, 129)" }}>
							&copy; 2023 -{" "}
							<a href="https://smswithoutborders.com/">
								<span>SMSWithoutBorders</span>
							</a>
							.
						</p>
					</div>
				</div>
			</section>

			<script src="https://cdn.anychart.com/releases/8.9.0/js/anychart-base.min.js"></script>
			<script src="https://cdn.anychart.com/releases/8.9.0/js/anychart-map.min.js"></script>
			<script src="https://cdn.anychart.com/geodata/latest/custom/world/world.js"></script>
			<script src="https://cdn.anychart.com/releases/8.9.0/js/anychart-data-adapter.min.js"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.15/proj4.js"></script>
			<script src="https://cdn.anychart.com/releases/8.9.0/js/anychart-exports.min.js"></script>
			<script src="https://cdn.anychart.com/releases/8.9.0/js/anychart-ui.min.js"></script>
			<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/js/all.min.js"></script>
			<script src="assets/js/main.js"></script>
		</div>
	);
};

export default OpenTelemetry;
