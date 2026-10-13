import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from '@mui/material/styles';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import ErrorBoundary from 'components/ErrorBoundary';
import { AuthProvider } from 'contexts/AuthContext';

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
          fontSize: 15,
          colorBgContainer: isDarkMode ? '#202020' : '#ffffff',
          colorBorder: isDarkMode ? '#3a3a3a' : '#d9d9d9',
          colorText: isDarkMode ? '#d9d9d9' : 'rgba(0, 0, 0, 0.88)',
          colorTextSecondary: isDarkMode ? '#a6a6a6' : 'rgba(0, 0, 0, 0.65)',
          colorBgElevated: isDarkMode ? '#222222' : '#ffffff',
          colorBgLayout: isDarkMode ? '#0b0b0b' : '#f3f4f7'
        }
      }}
    >
      <AuthProvider>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </AuthProvider>
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
