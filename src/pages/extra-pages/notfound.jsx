// material-ui
import { Box, List, ListItem, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| DOCUMENTATION PAGE ||============================== //

export default function NotFound() {
  return (
    <Box sx={{}}>
      <Typography variant="h2" gutterBottom>
        OOPS!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Seems the page you are looking for does not exist
      </Typography>
    </Box>
  );
}
