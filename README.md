# RelaySMS Telemetry Dashboard

Welcome to the RelaySMS Telemetry Dashboard, a comprehensive OpenTelemetry dashboard designed to monitor and visualize SMS gateway reliability, client performance, and publication metrics.

## Features

- **OpenTelemetry Dashboard**: Real-time monitoring of telemetry data with interactive charts and geographical visualizations
- **Publications Tracking**: Monitor message publications across different platforms and regions
- **Reliability Testing**: Track gateway client reliability tests and performance metrics

## Getting Started

To get started with the RelaySMS Telemetry Dashboard, follow these simple steps:

1. **Create .env File**: Create a `.env` file in the root directory of the project based on `.env.template`. Add the following variables:

```bash
VITE_APP_VERSION = v0.2.0
GENERATE_SOURCEMAP = false

PUBLIC_URL = http://localhost
VITE_APP_BASE_NAME = /dashboard
VITE_APP_TELEMETRY_API = 
VITE_APP_GATEWAY_SERVER_URL = 
```

> [!NOTE]
> Please ensure to replace the URLs with your actual API endpoints.

2. **Install Dependencies**: Run the following command to install dependencies:

   ```bash
   yarn install
   ```

3. **Start the Development Server**: Once the dependencies are installed, start the development server by running:

   ```bash
   yarn start
   ```

   The application will open automatically at `http://localhost:3000`

4. **Build for Production**: To create a production build:

   ```bash
   yarn build
   ```

## Docker Deployment

The project includes Docker support for easy deployment:

1. **Build and run with Docker Compose**:

   ```bash
   docker compose -p staging-smswithoutborders up -d --build
   ```

2. **Required environment variables for Docker**:
   - `PORT`: HTTP port (default: 80)
   - `SSL_PORT`: HTTPS port (default: 443)
   - `SERVER_NAME`: Server domain name (default: localhost)
   - `SSL_CERTIFICATE_PATH`: Path to SSL certificate
   - `SSL_KEY_PATH`: Path to SSL key
   - `SSL_CHAIN_PATH`: Path to SSL certificate chain

## API Data Structure

### Reliability Endpoint

The reliability API returns client test data with the following structure:

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
      }
    ],
    "id": "1"
  }
]
```

## Tech Stack

The RelaySMS Telemetry Dashboard is built with modern web technologies:

### Core Framework
- **[React](https://reactjs.org/)**: JavaScript library for building user interfaces (v18.3.1)
- **[Vite](https://vitejs.dev/)**: Next-generation frontend build tool for fast development

### UI Libraries
- **[Material-UI (MUI)](https://mui.com/)**: Comprehensive React UI framework implementing Material Design
  - @mui/material: Core components
  - @mui/x-charts: Advanced charting components
  - @mui/x-date-pickers: Date and time picker components
- **[Ant Design Icons](https://ant.design/components/icon/)**: Icon library for enhanced UI

### Additional Libraries
- **[React Router](https://reactrouter.com/)**: Declarative routing for React (v7.1.3)
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client for API requests
- **[Day.js](https://day.js.org/)**: Lightweight date manipulation library
- **[SWR](https://swr.vercel.app/)**: React hooks for data fetching
- **[Yup](https://github.com/jquense/yup)**: Schema validation
- **[simplebar-react](https://github.com/Grsmto/simplebar)**: Custom scrollbar component

### Development Tools
- **[ESLint](https://eslint.org/)**: Code linting and quality checks
- **[Prettier](https://prettier.io/)**: Code formatting
- **[Knip](https://knip.dev/)**: Find unused files, dependencies and exports

## Package Manager

This project uses **Yarn 4.9.4+** as the package manager. Make sure you have Yarn installed before running the project.

## Scripts

- `yarn start`: Start the development server
- `yarn build`: Build for production
- `yarn build-stage`: Build for staging environment
- `yarn preview`: Preview production build locally
- `yarn lint`: Lint code
- `yarn lint:fix`: Lint and auto-fix issues
- `yarn prettier`: Format code with Prettier
- `yarn knip`: Detect unused files and dependencies

## License

See the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Available in the dashboard under Support > Documentation
- **GitHub**: [github.com/smswithoutborders](https://github.com/smswithoutborders)
- **X (Twitter)**: [@RelaySMS](https://x.com/RelaySMS)