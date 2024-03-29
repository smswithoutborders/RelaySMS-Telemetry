import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

export default function Help() {
	return (
		<Grid container sx={{ px: { md: 10, xs: 2 }, py: { md: 10, xs: 8 } }}>
			<Grid item md={2}></Grid>
			<Grid item md={10}>
				<Typography variant="h4" sx={{ fontWeight: 600 }}>
					Relay open dashboard for gateway clients reliability
				</Typography>

				<Box sx={{ py: 5 }}>
					<Typography>
						Welcome to our comprehensive dashboard displaying verified(reliable) gateway clients
						across various locations. With this intuitive tool, you gain access to a curated list of
						reliable gateway clients within your proximity. Utilize this dashboard to efficiently
						route your messages to RelaySMS supported online platforms.
					</Typography>

					<Box sx={{ display: "flex", color: "#98B6F3" }}>
						<a href="">
							<Typography sx={{ pt: 3 }}>
								Check out this comprehensive blog post on gateway clients{" "}
							</Typography>
						</a>
						<ChevronRight style={{ marginTop: 24 }} />
					</Box>
				</Box>

				<Box sx={{ py: 3 }}>
					<Typography variant="h6" sx={{ fontWeight: 600, py: 1 }}>
						Dictionary
					</Typography>
					<ul>
						<li>MSISDN - Phone numbers</li>
						<br />
						<li>Operator - Local network providers </li> <br />
						<li>
							Gateway clients - I do not know{" "}
							<a href="" style={{ color: "#98B6F3" }}>
								{" "}
								learn more{" "}
							</a>
						</li>
					</ul>
				</Box>

				<Box sx={{ pb: 5 }}>
					<Typography variant="h6" sx={{ fontWeight: 600, py: 1 }}>
						How it works
					</Typography>
					<Typography>
						Our interactive table presents a visual representation of all reliable gateway clients
						along with their respective tests. This data is conveniently sortable to suit your
						preferences. You can arrange the table in ascending or descending order, conduct
						country-specific searches, narrow down results by date, and even perform
						operator-specific searches for enhanced efficiency and ease of use.
					</Typography>

					<Box component="img" src="/table.png" sx={{ width: "80%", my: 2 }} />

					<Grid container rowSpacing={5} sx={{ mt: 3 }}>
						<Grid item md={8} sm={8} xs={12}>
							<Typography variant="body1" sx={{ fontWeight: 600, py: 1 }}>
								Country Filter
							</Typography>
							<Typography>
								Utilize the country filter to refine your search specifically to your region. By
								selecting your country, you gain the ability to pinpoint the most dependable gateway
								available for your use. This streamlined approach ensures that you can confidently
								select the optimal gateway to meet your messaging needs within your local context.
							</Typography>
						</Grid>
						<Grid item md={4} sm={4} xs={12}>
							<Box component="img" src="/countryfilter.png" sx={{ width: "100%" }} />
						</Grid>
						<Grid item md={8} sm={8} xs={12}>
							<Typography variant="body1" sx={{ fontWeight: 600, py: 1 }}>
								Operator Filter
							</Typography>
							<Typography>
								For further precision, you can narrow down your search to the available network
								operators (providers) within your country. This feature allows you to select from a
								range of network operators, enabling you to identify the most suitable gateway for
								your messaging requirements based on specific provider preferences or network
								reliability.
							</Typography>
						</Grid>
						<Grid item md={4} sm={4} xs={12}>
							<Box component="img" src="/operatorfilter.png" sx={{ width: "100%" }} />
						</Grid>
						<Grid item md={8} sm={8} xs={12}>
							<Typography variant="body1" sx={{ fontWeight: 600, py: 1 }}>
								Date Filter
							</Typography>
							<Typography>
								The date filter operates independently, yet seamlessly integrates with country and
								operator filters for enhanced precision. This versatile tool empowers you to
								pinpoint the most recent gateway tests for reliability. Whether used alone or in
								conjunction with country and operator filters, the date filter ensures that you stay
								updated with the latest information, aiding you in making informed decisions
								regarding your choice of gateway.
							</Typography>
						</Grid>
						<Grid item md={4} sm={4} xs={12}>
							<Box component="img" src="/datefilter.png" sx={{ width: "100%" }} />
						</Grid>
					</Grid>
				</Box>
				{/*  */}
				<Box sx={{ py: 3 }}>
					<Typography variant="h6" sx={{ fontWeight: 600, py: 1 }}>
						Contribution
					</Typography>
					<Typography>
						Would you like to contribute to our project? We are an open-source initiative and we
						warmly invite you to participate. Feel free to explore our GitHub repository to get
						started! Your contributions are highly valued and can make a significant difference to
						our projects success. We look forward to collaborating with you!
					</Typography>
				</Box>
			</Grid>
		</Grid>
	);
}
