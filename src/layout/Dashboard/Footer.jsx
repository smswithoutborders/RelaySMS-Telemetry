// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: '24px 16px 0px', mt: 'auto' }}>
      <Typography variant="caption">
        &copy; All rights reserved{' '}
        <Link href="https://smswithoutborders.com/" target="_blank" underline="hover">
          SMSWithoutBorders
        </Link>
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="https://smswithoutborders.com/" target="_blank" variant="caption" color="text.primary">
          About us
        </Link>
        <Link href="https://smswithoutborders.com/privacy-policy" target="_blank" variant="caption" color="text.primary">
          Privacy
        </Link>
        <Link href="mailto:developers@smswithoutborders.com" target="_blank" variant="caption" color="text.primary">
          Contact
        </Link>
      </Stack>
    </Stack>
  );
}
