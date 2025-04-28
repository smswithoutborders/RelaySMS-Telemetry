# SMSWithoutBorders Visibility Dashboard

Welcome to the SMSWithoutBorders T Dashboard, a powerful tool designed to measure the reliability of gateway clients and available gateway servers.

## Getting Started

To get started with the SMSWithoutBorders Dashboard, follow these simple steps:

1. **Create .env File**: Create a `.env` file in the root directory of the project. Add variables:

```
REACT_APP_GATEWAY_SERVER_URL=
```

> [!NOTE]
> Please ensure to replace the placeholders with real URLs pointing to your reliability and resilience data sources.

2. **Install Dependencies**: Run the following command to install dependencies:

   ```
   yarn install
   ```

3. **Start the Application**: Once the dependencies are installed, start the application by running:

   ```
   yarn start
   ```

## Data Structure

### Reliability

```json
[
	{
		"country": "United States of America",
		"operator": "Verizon Wireless",
		"countrycode": "US",
		"resilience": "4",
		"date": "2068-11-07T13:46:36.446Z",
		"msisdn": "+1-756-699-4569 x28073",
		"testdata": [
			{
				"test_id": "1",
				"sent_time": "14:00:00",
				"sms_sent": "14:05:00",
				"sms_received": "14:10:00",
				"published": "14:15:00",
				"operator_difference": "00:05:00",
				"publisher_difference": "00:05:00",
				"total_difference": "00:10:00"
			},
			{
				"test_id": "2",
				"sent_time": "15:00:00",
				"sms_sent": "15:05:00",
				"sms_received": "15:10:00",
				"published": "15:15:00",
				"operator_difference": "00:05:00",
				"publisher_difference": "00:05:00",
				"total_difference": "00:10:00"
			}
		],
		"id": "1"
	},
	{
		"country": "Kyrgyz Republic",
		"operator": "MegaCom",
		"countrycode": "KG",
		"resilience": "3",
		"date": "2071-05-10T06:29:23.635Z",
		"msisdn": "+996-859-809-9556",
		"testdata": [
			{
				"test_id": "1",
				"sent_time": "06:45:00",
				"sms_sent": "06:50:00",
				"sms_received": "06:55:00",
				"published": "07:00:00",
				"operator_difference": "00:05:00",
				"publisher_difference": "00:05:00",
				"total_difference": "00:10:00"
			},
			{
				"test_id": "2",
				"sent_time": "07:45:00",
				"sms_sent": "07:50:00",
				"sms_received": "07:55:00",
				"published": "08:00:00",
				"operator_difference": "00:05:00",
				"publisher_difference": "00:05:00",
				"total_difference": "00:10:00"
			}
		],
		"id": "2"
	}
]
```

## Tools Used

The SMSWithoutBorders Dashboard utilizes the following tools and libraries:

- **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.

- **[Material-UI (Mui)](https://mui.com/material-ui/)**: A popular React UI framework that implements Google's Material Design

.

- **[Material-UI Data Grid](https://mui.com/components/data-grid/)**: An extension of Material-UI providing a powerful data grid component for React applications.

- **[React Icons](https://react-icons.github.io/react-icons/)**: A collection of popular icons for React projects.