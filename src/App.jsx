import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from '@mui/material/styles';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import ErrorBoundary from 'components/ErrorBoundary';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

function AppContent() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: theme.palette.primary.main,
          borderRadius: 4,
          colorBgContainer: isDarkMode ? '#1e293b' : '#ffffff',
          colorBorder: isDarkMode ? '#334155' : '#d9d9d9',
          colorText: isDarkMode ? '#e2e8f0' : 'rgba(0, 0, 0, 0.88)',
          colorTextSecondary: isDarkMode ? '#94a3b8' : 'rgba(0, 0, 0, 0.65)',
          colorBgElevated: isDarkMode ? '#0f172a' : '#ffffff',
          colorBgLayout: isDarkMode ? '#0a1929' : '#f5f5f5'
        }
      }}
    >
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeCustomization>
        <AppContent />
      </ThemeCustomization>
    </ErrorBoundary>
  );
}
