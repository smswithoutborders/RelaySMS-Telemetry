// material-ui
import { Box, List, ListItem, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| DOCUMENTATION PAGE ||============================== //

export default function Documentation() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        RelaySMS Open Telemetry
      </Typography>
      <Typography variant="body1" gutterBottom>
        Welcome to the RelaySMS dashboard documentation. This platform provides insights into user activity, message delivery, and service
        performance across different regions. The goal is to ensure transparency, track reliability, and support regions affected by
        internet restrictions with timely interventions.
      </Typography>

      <Box sx={{ my: 3 }}>
        <List>
          <Typography variant="h5" gutterBottom>
            Dictionary
          </Typography>
          <ListItem>
            <ListItemText primary="MSISDN - Mobile phone number (user identifier)." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Operator - Local network provider responsible for mobile connectivity." />
          </ListItem>
          <ListItem>
            <ListItemText primary="Gateway Clients - Systems responsible for routing SMS messages to online platforms." />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          Open Telemetry Table
        </Typography>
        <Typography variant="body1" gutterBottom>
          This section displays user signups, active users, and geographical distribution. It helps us identify areas affected by internet
          shutdowns and find ways to provide better access and support.
        </Typography>
        <Typography fontWeight="bold" variant="body1" gutterBottom>
          How It Works:
        </Typography>
        <Typography variant="body1" gutterBottom>
          <ul>
            <li>If you're viewing data from Jan 1-31 (31 days), it compares against the previous 31 days (Dec 1-31)</li>
            <li>Positive percentages show growth (displayed in green)</li>
            <li>Negative percentages show decline (displayed in red via the isLoss prop)</li>
            <li>
              The percentage shown represents the actual change: e.g., "+25.50%" means 25.5% increase, "-10.20%" means 10.2% decrease{' '}
            </li>
          </ul>
          This gives you real insights into whether your metrics are improving or declining over time!
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          Publications
        </Typography>
        <Typography variant="body1" gutterBottom>
          This section tracks the number of messages sent, whether successful or failed. Monitoring message delivery helps identify issues
          with specific platforms or services.
        </Typography>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5" gutterBottom>
          Reliability
        </Typography>
        <Typography variant="body1" gutterBottom>
          Here, we measure the performance and reliability of gateway clients. Automated tests help detect problems in message routing so we
          can quickly address them and maintain service quality.
        </Typography>
      </Box>

      <Box sx={{ my: 3, pt: 4, borderTop: '1px solid #ccc' }}>
        <Typography variant="h5" gutterBottom>
          🌱 Contribute to RelaySMS
        </Typography>
        <Typography variant="body1" gutterBottom>
          RelaySMS is an open-source project built with community support in mind. Whether you're a developer, designer, writer, or just
          someone passionate about digital communication, we'd love your help. You can contribute by reporting bugs, suggesting features, or
          helping improve our codebase and documentation.
        </Typography>
        <Typography variant="body1" gutterBottom>
          To get started, visit our GitHub repository or reach out to the team directly. Together, we can make communication more accessible
          and resilient for everyone.
        </Typography>
      </Box>
    </Box>
  );
}
