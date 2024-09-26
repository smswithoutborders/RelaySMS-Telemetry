# SMSWithoutBorders Visibility Dashboard

Welcome to the SMSWithoutBorders Dashboard, a powerful tool designed to measure the reliability of gateway clients and available gateway servers.

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

### Resilience

```json
[
	{
		"msisdn": "875-808-2812",
		"country": "Paraguay",
		"operator": "Handmade Steel Towels",
		"resilience": "New Jersey",
		"regdate": 1712062353,
		"duration": "2093-02-09T16:23:41.760Z",
		"success": 67,
		"failure": 49,
		"error": false,
		"id": "1"
	},
	{
		"msisdn": "986-647-7185",
		"country": "Bermuda",
		"operator": "Oriental Wooden Soap",
		"resilience": "New York",
		"regdate": 1712062293,
		"duration": "2029-07-25T17:23:12.167Z",
		"success": 0,
		"failure": 6,
		"error": false,
		"id": "2"
	},
	{
		"msisdn": "532-992-5995",
		"country": "Saint Helena",
		"operator": "Bespoke Granite Shirt",
		"resilience": "Arkansas",
		"regdate": 1712062233,
		"duration": "2082-02-24T02:19:01.931Z",
		"success": 91,
		"failure": 43,
		"error": false,
		"id": "3"
	},
	{
		"msisdn": "803-965-0820",
		"country": "Guernsey",
		"operator": "Small Rubber Bike",
		"resilience": "Mississippi",
		"regdate": 1712062173,
		"duration": "1999-01-06T07:14:56.889Z",
		"success": 87,
		"failure": 18,
		"error": false,
		"id": "4"
	},
	{
		"msisdn": "554-915-2287",
		"country": "Norfolk Island",
		"operator": "Practical Steel Pants",
		"resilience": "Mississippi",
		"regdate": 1712062113,
		"duration": "2094-01-10T13:44:40.264Z",
		"success": 8,
		"failure": 28,
		"error": false,
		"id": "5"
	},
	{
		"msisdn": "420-639-5991",
		"country": "Kyrgyz Republic",
		"operator": "Luxurious Bronze Pants",
		"resilience": "Florida",
		"regdate": 1712062053,
		"duration": "1999-05-07T21:56:33.066Z",
		"success": 77,
		"failure": 32,
		"error": false,
		"id": "6"
	},
	{
		"msisdn": "418-775-2188",
		"country": "Serbia",
		"operator": "Ergonomic Fresh Cheese",
		"resilience": "Nebraska",
		"regdate": 1712061993,
		"duration": "2005-10-25T12:29:19.393Z",
		"success": 66,
		"failure": 48,
		"error": false,
		"id": "7"
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
