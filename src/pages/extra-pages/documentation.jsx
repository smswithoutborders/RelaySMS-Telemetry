// material-ui
import { Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| DOCUMENTATION PAGE ||============================== //

export default function Documentation() {
  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, position: 'relative' }}>
      {/* Table of Contents - Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 250,
          flexShrink: 0
        }}
      >
        <MainCard
          content={false}
          // elevation={1}
          sx={{
            position: 'sticky',
            top: 100,
            p: 2,
            // backgroundColor: 'background.paper',
            borderRadius: 0.5
          }}
        >
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Contents
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
              component="a"
              onClick={() => scrollToSection('getting-started')}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline', fontWeight: 'bold' },
                py: 0.5
              }}
            >
              Getting Started
            </Box>
            <Box
              component="a"
              onClick={() => scrollToSection('key-terms')}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline', fontWeight: 'bold' },
                py: 0.5
              }}
            >
              Key Terms & Dictionary
            </Box>
            <Box
              component="a"
              onClick={() => scrollToSection('dashboard')}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline', fontWeight: 'bold' },
                py: 0.5
              }}
            >
              Dashboard
            </Box>
            <Box
              component="a"
              onClick={() => scrollToSection('publications')}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline', fontWeight: 'bold' },
                py: 0.5
              }}
            >
              Publications
            </Box>
            <Box
              component="a"
              onClick={() => scrollToSection('reliability')}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline', fontWeight: 'bold' },
                py: 0.5
              }}
            >
              Reliability
            </Box>
            <Box
              component="a"
              onClick={() => scrollToSection('tips')}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline', fontWeight: 'bold' },
                py: 0.5
              }}
            >
              Tips & Best Practices
            </Box>
            <Box
              component="a"
              onClick={() => scrollToSection('contribute')}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline', fontWeight: 'bold' },
                py: 0.5
              }}
            >
              Contribute
            </Box>
          </Box>
        </MainCard>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, minWidth: 0, mt: 2 }}>
        <Typography sx={{ mb: 3 }} variant="h3" gutterBottom>
          RelaySMS Open Telemetry Documentation
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to the RelaySMS Telemetry Dashboard! This platform provides comprehensive insights into user activity, message delivery
          performance, and service reliability across different regions. Our mission is to ensure transparency, track system health, and
          support communities affected by internet restrictions with data-driven interventions.
        </Typography>

        <Box sx={{ mb: 3, mt: 6 }} id="getting-started">
          <Typography variant="h5" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body1" gutterBottom>
            This dashboard consists of three main sections, each offering unique insights into the RelaySMS ecosystem:
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary={<strong>Dashboard (Open Telemetry)</strong>}
                  secondary="Overview of user signups, active users, and geographical distribution."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Publications</strong>}
                  secondary="Tracks messages sent through RelaySMS, including success and failure rates."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Reliability</strong>}
                  secondary="Monitors the health and performance of gateway clients that power the service."
                />
              </ListItem>
            </List>
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
            Use the navigation menu on the left to switch between sections. Each page includes filters for customizing date ranges,
            countries, and other parameters. You can download data from any page for offline analysis or reporting.
          </Typography>
        </Box>

        <Box sx={{ mb: 3, mt: 6 }} id="key-terms">
          <Typography variant="h5" gutterBottom>
            Key Terms & Dictionary
          </Typography>
          <Typography variant="body1" gutterBottom>
            Understanding these terms will help you navigate the dashboard more effectively:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary={<strong>MSISDN</strong>}
                secondary="Mobile Station International Subscriber Directory Number - essentially a mobile phone number in international format. This serves as a unique identifier for users and gateway devices."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<strong>Operator</strong>}
                secondary="The mobile network provider or carrier (e.g., Vodafone, MTN, AT&T) responsible for providing cellular connectivity to a device."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<strong>Gateway Clients</strong>}
                secondary={
                  <span>
                    Mobile devices running the{' '}
                    <a href="https://dekusms.com" target="_blank" rel="noopener noreferrer">
                      DekuSMS
                    </a>{' '}
                    app that act as bridges, routing SMS messages from users to online platforms like Gmail, Twitter, or Telegram.
                  </span>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<strong>Publications</strong>}
                secondary="Messages sent through RelaySMS from users to various online platforms. Each publication attempt is logged with its status (successful or failed)."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<strong>Sign-up Users</strong>}
                secondary="Users who have attempted to create an account with RelaySMS, whether the signup was completed successfully or not."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<strong>Retained Users</strong>}
                secondary="Users who successfully signed up and still have active accounts (not deleted). These represent the current user base."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<strong>Tokens</strong>}
                secondary="Authentication credentials that allow users to connect and publish to specific platforms (Gmail, Twitter, etc.). Users with tokens can actively send messages."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<strong>Bridge First Users</strong>}
                secondary={
                  <span>
                    Users who sent a message using{' '}
                    <a href="https://blog.smswithoutborders.com/posts/Bridges" target="_blank" rel="noopener noreferrer">
                      bridge
                    </a>{' '}
                    alias (e.g. +1234567890@relaysms.me) without login or signup.
                  </span>
                }
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mb: 3, mt: 6 }} id="dashboard">
          <Typography variant="h5" gutterBottom>
            Dashboard (Open Telemetry)
          </Typography>
          <Typography variant="body1" gutterBottom>
            The Dashboard is the main overview page that displays comprehensive metrics about user signups, active users, and geographical
            distribution. It helps identify areas affected by internet shutdowns and track service adoption patterns across different
            regions.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            Data Points Explained:
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
            Sign-up Category
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary={<strong>Sign-up Users</strong>}
                  secondary="Total number of users who attempted to create an account in the selected time period. This includes all signup attempts, whether successful or not."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Sign-up Countries</strong>}
                  secondary="The number of unique countries from which signup attempts originated. Helps identify geographical reach and expansion."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Email Signups</strong>}
                  secondary="Number of users who signed up using an email address. This metric tracks users who provided email contact information during registration."
                />
              </ListItem>
            </List>
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
            Users Category
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary={<strong>New Users</strong>}
                  secondary="Total number of new users who created accounts in the selected time period. These are successful signups that resulted in active accounts."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>New Countries</strong>}
                  secondary="Number of unique countries from which new users originated. Indicates geographical growth of the user base."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Email New Users</strong>}
                  secondary="Number of new users who signed up with an email address during the selected period. Tracks email-based registrations."
                />
              </ListItem>
            </List>
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
            Additional Metrics
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary={<strong>Bridge First Users</strong>}
                  secondary="Users who sent a message using bridge alias (e.g. +1234567890@relaysms.me) without login or signup."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Users with Tokens</strong>}
                  secondary="Active users who have authentication tokens for connected platforms (Gmail, Twitter, etc.). These users can actively publish messages through RelaySMS."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Publications</strong>}
                  secondary="Total number of messages sent through the RelaySMS service during the selected period, including both successful and failed deliveries."
                />
              </ListItem>
            </List>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
            Percentage Changes - How It Works:
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary="Understanding Percentage Changes"
                  secondary="Each metric card displays a percentage change compared to an equivalent previous period. This helps track trends over time."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Positive vs. Negative Changes"
                  secondary="Positive percentages (green) indicate growth, while negative percentages (red) indicate decline compared to the previous period."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Comparison Periods"
                  secondary="Each metric shows a percentage change compared to an equivalent previous period. For example, if you're viewing data from Jan
              1-31 (31 days), it compares against the previous 31 days (Dec 1-31)."
                />
              </ListItem>
            </List>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
            Interactive Features:
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary="Category Filter:"
                  secondary="Switch between 'Sign-up Users' and 'Users' to view different datasets."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Date Range Filter"
                  secondary="Select predefined ranges (Today, Last 7 Days, This Month) or choose a custom date range."
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Country Filter" secondary="Filter data by specific country to analyze regional performance." />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Show Totals Toggle"
                  secondary="Hide or show the metric cards at the top for a cleaner view of charts and tables."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Country Map"
                  secondary="Interactive visualization showing user distribution across countries. Click on countries to see detailed statistics."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Download Data"
                  secondary="Export all current dashboard data as a JSON file for offline analysis or reporting."
                />
              </ListItem>
            </List>
          </Typography>
        </Box>

        <Box sx={{ mb: 3, mt: 6 }} id="publications">
          <Typography variant="h5" gutterBottom>
            Publications
          </Typography>
          <Typography variant="body1" gutterBottom>
            The Publications page tracks all messages sent through the RelaySMS platform. It provides insights into message delivery success
            rates, platform distribution, and helps identify issues with specific services or platforms.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            Data Points Explained:
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary={<strong>Total Publications</strong>}
                  secondary="The complete count of all message sending attempts through RelaySMS, regardless of success or failure status."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Total Published (Successful)</strong>}
                  secondary="Number of messages that were successfully delivered to the target platform (Gmail, Twitter, Telegram, etc.). These messages reached their destination without errors."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Total Failed</strong>}
                  secondary="Number of messages that failed to deliver. Failures can occur due to authentication issues, platform API errors, network problems, or invalid message formats."
                />
              </ListItem>
            </List>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
            Features:
          </Typography>
          <Typography variant="body2" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary={<strong>Publication Trends Chart:</strong>}
                  secondary="Visual timeline showing publication volumes over time, with separate lines for successful and failed messages."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Platform Distribution Chart:</strong>}
                  secondary="Pie or bar chart showing which platforms (Gmail, Twitter, Telegram, Mastodon, etc.) receive the most publications."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Peak Usage Hours Heatmap:</strong>}
                  secondary={
                    <span>
                      A weekly pattern visualization showing when users are most active throughout the week. The heatmap displays:
                      <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                        <li>
                          <strong>7 rows</strong> - Days of the week (Sunday through Saturday)
                        </li>
                        <li>
                          <strong>24 columns</strong> - Hours of the day (0-23, representing midnight to 11 PM)
                        </li>
                        <li>
                          <strong>Color intensity</strong> - Darker colors indicate higher publication activity
                        </li>
                      </ul>
                      The heatmap aggregates ALL publications within your selected date range. For example, if you're viewing a full year of
                      data, all Mondays at 2 PM are counted together, all Tuesdays at 9 AM together, etc. This reveals typical usage
                      patterns: which day/hour combinations see the most activity. Hover over any cell to see the exact publication count
                      for that day/hour combination. Use this to identify peak traffic times for capacity planning, optimal maintenance
                      windows, and understanding user behavior across different time zones.
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Platform Success Rate Chart:</strong>}
                  secondary={
                    <span>
                      A bar chart comparing the reliability of different platforms (Gmail, Twitter, Telegram, etc.). Shows:
                      <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                        <li>
                          <strong>Success Rate Percentage</strong> - Calculated as (successful publications / total publications) × 100
                        </li>
                        <li>
                          <strong>Platform Colors</strong> - Each platform displays in its brand color for easy identification
                        </li>
                        <li>
                          <strong>Sorted by Performance</strong> - Platforms are ordered from highest to lowest success rate
                        </li>
                      </ul>
                      Use this chart to quickly identify which platforms are most reliable and which may need attention. A sudden drop in
                      success rate for a specific platform could indicate API changes, authentication issues, or service disruptions.
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Platform Performance Summary:</strong>}
                  secondary={
                    <span>
                      Detailed performance cards showing comprehensive statistics for each platform:
                      <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
                        <li>
                          <strong>Platform Name</strong> - With brand color indicator
                        </li>
                        <li>
                          <strong>Success Rate</strong> - Large percentage display (e.g., 98.5%)
                        </li>
                        <li>
                          <strong>Success Count</strong> - Number of successful publications out of total attempts (e.g., 1,234 / 1,250
                          successful)
                        </li>
                        <li>
                          <strong>Failed Count</strong> - Number of failed publications (displayed in red if failures exist)
                        </li>
                      </ul>
                      These cards provide at-a-glance metrics for each platform's reliability. Use them to monitor platform health, identify
                      problematic platforms, and track improvements over time. The color-coded indicators make it easy to spot which
                      platforms need investigation.
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Detailed Publications Table:</strong>}
                  secondary="Lists individual publication attempts with columns for:"
                />
              </ListItem>

              <List>
                <ListItem>MSISDN (user phone number)</ListItem>
                <ListItem>Country of origin</ListItem>
                <ListItem>Target platform</ListItem>
                <ListItem>Status (published/failed)</ListItem>
                <ListItem>Timestamp of the publication attempt</ListItem>
              </List>

              <ListItem>
                <ListItemText
                  primary={<strong>Filters:</strong>}
                  secondary="Filter by status (all/published/failed), platform type, country, and date range to analyze specific scenarios."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Download Data:</strong>}
                  secondary="Export publication data for further analysis or record-keeping."
                />
              </ListItem>
            </List>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
            Why It Matters:
          </Typography>
          <Typography variant="body2" gutterBottom>
            Monitoring publication success rates helps identify problems with specific platforms or services quickly. A sudden increase in
            failed publications might indicate API changes, authentication issues, or service outages that need immediate attention.
          </Typography>
        </Box>

        <Box sx={{ mb: 3, mt: 6 }} id="reliability">
          <Typography variant="h5" gutterBottom>
            Reliability
          </Typography>
          <Typography variant="body1" gutterBottom>
            The Reliability page monitors the performance and health of gateway clients (mobile devices that relay SMS messages to online
            platforms). Automated tests continuously check these gateways to ensure they can receive and process messages correctly.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            What Are Gateway Clients?
          </Typography>
          <Typography variant="body1" gutterBottom>
            Gateway clients are mobile devices running the RelaySMS app that act as bridges between SMS and internet platforms. They receive
            SMS messages from users and forward them to online services (Gmail, Twitter, etc.). Keeping these gateways reliable is crucial
            for service availability.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            Data Points Explained:
          </Typography>
          <Typography variant="body2" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary={<strong>Total Gateway Clients</strong>}
                  secondary="The number of active gateway devices currently participating in the RelaySMS network."
                />
              </ListItem>
              <ListItem>
                <ListItemText primary={<strong>MSISDN</strong>} secondary="The mobile phone number (identifier) of the gateway device." />
              </ListItem>
              <ListItem>
                <ListItemText primary={<strong>Country</strong>} secondary="The country where the gateway client is located." />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Operator</strong>}
                  secondary="The mobile network provider (carrier) that the gateway client uses for connectivity."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Test Status</strong>}
                  secondary={
                    <span>
                      Results of the most recent automated test:
                      <ul style={{ marginTop: '8px' }}>
                        <li>
                          <strong style={{ color: 'green' }}>Success/Passed:</strong> The gateway successfully received and processed the
                          test message.
                        </li>
                        <li>
                          <strong style={{ color: 'red' }}>Failed:</strong> The gateway did not respond correctly or failed to process the
                          test message.
                        </li>
                        <li>
                          <strong style={{ color: 'orange' }}>Pending:</strong> Test is in progress or scheduled.
                        </li>
                      </ul>
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText primary={<strong>Last Test Time</strong>} secondary="Timestamp showing when the gateway was last tested." />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Response Time</strong>}
                  secondary="How quickly the gateway responded to the test message (in seconds or milliseconds)."
                />
              </ListItem>
            </List>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
            Features:
          </Typography>
          <Typography variant="body2" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary={<strong>Gateway Status Overview:</strong>}
                  secondary="Summary cards showing total gateways, successful tests, and failed tests."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Reliability Table:</strong>}
                  secondary="Detailed list of all gateway clients with their current status and test history."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Test Details:</strong>}
                  secondary="Click on individual gateway entries to view complete test history, error messages, and performance trends."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Filters:</strong>}
                  secondary="Filter by country, operator, or test status to identify problematic regions or networks."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Automated Testing:</strong>}
                  secondary="The system runs periodic tests to ensure gateways remain functional. Test frequency can vary based on gateway importance and historical reliability."
                />
              </ListItem>
            </List>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
            Why It Matters:
          </Typography>
          <Typography variant="body2" gutterBottom>
            Gateway reliability is essential for service quality. By continuously testing gateways, we can quickly detect and address issues
            like network problems, device malfunctions, or regional disruptions. This proactive monitoring helps maintain high availability
            and ensures users can rely on RelaySMS when internet access is restricted or unavailable.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }} id="tips">
          <Typography variant="h6" gutterBottom>
            Tips & Best Practices
          </Typography>
          <Typography variant="body2" component="div" gutterBottom>
            <List>
              <ListItem>
                <ListItemText
                  primary={<strong>Compare Time Periods</strong>}
                  secondary="Use the percentage changes to understand trends. Consistent negative trends may
              indicate issues requiring attention."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Filter by Country</strong>}
                  secondary="When investigating regional issues, filter data by specific countries to isolate problems
              and track improvements."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Download Data Regularly</strong>}
                  secondary="Export data periodically for historical analysis, reporting, or backup purposes."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Monitor Failed Publications</strong>}
                  secondary="A sudden spike in failed publications often indicates
              service disruptions that need immediate investigation."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Check Gateway Reliability</strong>}
                  secondary="Regularly review the Reliability page to ensure sufficient healthy gateways are
              available in each region."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Use Custom Date Ranges</strong>}
                  secondary="For detailed analysis, use custom date ranges to examine specific events or
              incidents."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={<strong>Watch for Regional Patterns</strong>}
                  secondary="The country map and tables can reveal patterns related to internet shutdowns,
              political events, or network issues in specific regions."
                />
              </ListItem>
            </List>
          </Typography>
        </Box>

        <Box sx={{ my: 3, pt: 4, borderTop: '1px solid #ccc' }} id="contribute">
          <Typography variant="h5" gutterBottom>
            🌱 Contribute to RelaySMS
          </Typography>
          <Typography variant="body1" gutterBottom>
            RelaySMS is an open-source project built with community support in mind. Whether you're a developer, designer, writer, or just
            someone passionate about digital communication, we'd love your help. You can contribute by reporting bugs, suggesting features,
            or helping improve our codebase and documentation.
          </Typography>
          <Typography variant="body1" gutterBottom>
            To get started, visit our GitHub repository or reach out to the team directly. Together, we can make communication more
            accessible and resilient for everyone.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
