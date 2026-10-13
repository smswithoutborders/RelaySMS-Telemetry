import PropTypes from 'prop-types';
import countries from 'i18n-iso-countries';

// material-ui
import Box from '@mui/material/Box';

// assets
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';

// Square SVG flags from flag-icons, emitted as separate files (no-inline) so the browser only fetches the ones shown.
// Importing the package's CSS instead would inline all ~270 flags into one 400 KB stylesheet.
const FLAG_URLS = import.meta.glob('/node_modules/flag-icons/flags/1x1/*.svg', { eager: true, query: '?no-inline', import: 'default' });

function flagUrl(iso) {
  return FLAG_URLS[`/node_modules/flag-icons/flags/1x1/${iso.toLowerCase()}.svg`];
}

// ==============================|| COUNTRY FLAG ||============================== //

export default function CountryFlag({ code, size = 28 }) {
  const iso = code?.toUpperCase();
  const src = iso && countries.isValid(iso) ? flagUrl(iso) : null;
  const ring = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider}`
  };

  if (!src) {
    return (
      <Box
        aria-hidden
        sx={{
          ...ring,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: 'text.secondary'
        }}
      >
        <GlobalOutlined style={{ fontSize: size * 0.55 }} />
      </Box>
    );
  }
  return <Box component="img" src={src} alt="" loading="lazy" sx={{ ...ring, display: 'block', objectFit: 'cover' }} />;
}

CountryFlag.propTypes = { code: PropTypes.string, size: PropTypes.number };
