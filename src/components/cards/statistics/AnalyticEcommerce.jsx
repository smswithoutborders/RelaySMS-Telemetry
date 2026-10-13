import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// project imports
import MainCard from 'components/MainCard';

// assets
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';

const iconSX = { fontSize: '0.75rem', marginLeft: 0, marginRight: 0 };

// info: optional tooltip content, shown from an ⓘ beside the title (hover or keyboard focus).
export default function AnalyticEcommerce({ color = 'primary', title, count, percentage, isLoss, extra, info }) {
  // The deeper shades read better as small text.
  const percentageColor = isLoss ? 'error.dark' : 'success.dark';

  return (
    <MainCard contentSX={{ p: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Stack sx={{ gap: 0.25 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {info && (
            <Tooltip title={info} placement="bottom-start" enterTouchDelay={0} leaveTouchDelay={6000}>
              <Box
                component="span"
                tabIndex={0}
                role="button"
                aria-label={`About ${title}`}
                sx={{ display: 'inline-flex', color: 'text.secondary', cursor: 'help', fontSize: '0.8125rem', borderRadius: '50%' }}
              >
                <InfoCircleOutlined />
              </Box>
            </Tooltip>
          )}
        </Stack>
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <Typography variant="h5" color="inherit">
            {count}
          </Typography>
          {percentage && (
            <Box sx={{ ml: 1.25, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isLoss ? <FallOutlined style={{ ...iconSX, color: 'inherit' }} /> : <RiseOutlined style={{ ...iconSX, color: 'inherit' }} />}
              <Typography variant="caption" color={percentageColor} sx={{ fontWeight: 500 }}>
                {percentage}%
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
      <Box sx={{ pt: 0.25 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {extra}
        </Typography>
      </Box>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string,
  info: PropTypes.node
};
