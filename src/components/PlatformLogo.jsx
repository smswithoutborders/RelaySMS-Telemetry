import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// project imports
import { NO_PLATFORM, PLATFORMS } from 'utils/backendLabels';

// assets
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';

// ==============================|| PLATFORM LOGO ||============================== //

// The platform's logo from utils/backendLabels. No platform (a failure before it was known) gets a question mark; a
// platform the dashboard doesn't know gets a generic app icon. The RelaySMS logo is only for RelaySMS's own bridge.
// tile: draws it centred in a round tile, the same size as the country flags in breakdown lists.
export default function PlatformLogo({ name, size = 16, tile = false }) {
  const theme = useTheme();
  const info = name ? PLATFORMS[name.toLowerCase()] : null;

  let mark;
  if (info?.logo) {
    mark = (
      <img
        src={info.logo}
        alt=""
        width={size}
        height={size}
        style={{ objectFit: 'contain', filter: info.invertInDark && theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none' }}
      />
    );
  } else {
    const Icon = name ? AppstoreOutlined : QuestionCircleOutlined;
    mark = (
      <Tooltip title={name ? '' : NO_PLATFORM.long}>
        <Box component="span" sx={{ display: 'inline-flex', color: 'text.secondary', fontSize: size }}>
          <Icon />
        </Box>
      </Tooltip>
    );
  }

  if (!tile) return mark;
  return (
    <Box
      sx={{
        width: size + 12,
        height: size + 12,
        borderRadius: '50%',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover'
      }}
    >
      {mark}
    </Box>
  );
}

PlatformLogo.propTypes = { name: PropTypes.string, size: PropTypes.number, tile: PropTypes.bool };
