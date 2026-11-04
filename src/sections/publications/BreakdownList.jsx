import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// assets
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';

// ==============================|| BREAKDOWN LIST ||============================== //

const EXCLUDE_WIDTH = 88;
const EXCLUDE_TOUCH_WIDTH = 36;
const SLIDE = 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)';

export default function BreakdownList({
  rows,
  emptyText = 'No data in this period',
  onSelect,
  selectedKeys = [],
  maxRows,
  showRate = true,
  onExclude
}) {
  const theme = useTheme();
  const max = Math.max(1, ...rows.map((row) => row.total));
  const shown = maxRows ? rows.slice(0, maxRows) : rows;
  const hidden = rows.length - shown.length;

  if (rows.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyText}</Typography>
      </Box>
    );
  }

  return (
    <Stack sx={{ gap: 1.75 }}>
      {shown.map((row) => {
        const hasStatus = row.published !== undefined;
        const rate = showRate && hasStatus && row.total ? (row.published / row.total) * 100 : null;
        const selected = selectedKeys.includes(row.key);
        const clickable = Boolean(onSelect) && row.key !== null;
        const excludable = Boolean(onExclude) && row.key !== null;
        return (
          <Box
            key={row.key ?? '__unknown'}
            onClick={clickable ? () => onSelect(row.key) : undefined}
            sx={{
              cursor: clickable ? 'pointer' : 'default',
              borderRadius: 1,
              mx: -1,
              px: 1,
              py: 0.5,
              bgcolor: selected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              '&:hover': clickable ? { bgcolor: alpha(theme.palette.primary.main, 0.05) } : undefined,
              position: 'relative',
              overflow: 'hidden',
              ...(excludable && {
                '&:focus-within .breakdown-values': { pr: `${EXCLUDE_WIDTH}px` },
                '&:focus-within .breakdown-exclude': { transform: 'translateX(0)' },
                '@media (hover: hover)': {
                  '&:hover .breakdown-values': { pr: `${EXCLUDE_WIDTH}px` },
                  '&:hover .breakdown-exclude': { transform: 'translateX(0)' }
                },
                '@media (hover: none)': { pr: `${EXCLUDE_TOUCH_WIDTH + 8}px` }
              })
            }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
              {row.icon}
              <Box className="breakdown-values" sx={{ flex: 1, minWidth: 0, transition: 'padding-right 0.25s cubic-bezier(0.2, 0, 0, 1)' }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <Typography variant="body2" sx={{ flex: 1, minWidth: 0, fontWeight: selected ? 600 : 400 }} noWrap title={row.label}>
                    {row.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {row.total.toLocaleString()}
                  </Typography>
                  {rate !== null && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ width: 64, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}
                      title="Success rate"
                    >
                      {rate.toFixed(1)}% ok
                    </Typography>
                  )}
                </Stack>
                <Tooltip
                  title={
                    hasStatus
                      ? ['published', 'rejected', 'failed']
                          .filter((status) => row[status] > 0)
                          .map((status) => `${row[status].toLocaleString()} ${status}`)
                          .join(' · ')
                      : `${row.total.toLocaleString()}`
                  }
                  placement="top"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '2px',
                      height: 8,
                      width: `${(row.total / max) * 100}%`,
                      minWidth: 4,
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    {hasStatus ? (
                      <>
                        {row.published > 0 && <Box sx={{ flex: row.published, bgcolor: 'success.main' }} />}
                        {row.rejected > 0 && <Box sx={{ flex: row.rejected, bgcolor: 'rejected.main' }} />}
                        {row.failed > 0 && <Box sx={{ flex: row.failed, bgcolor: 'error.main' }} />}
                      </>
                    ) : (
                      <Box sx={(theme) => ({ flex: 1, bgcolor: '#bfbfbf', ...theme.applyStyles('dark', { bgcolor: '#595959' }) })} />
                    )}
                  </Box>
                </Tooltip>
              </Box>
            </Stack>
            {excludable && (
              <ButtonBase
                className="breakdown-exclude"
                aria-label={`Exclude ${row.label}`}
                title={`Leave ${row.label} out of every chart and list`}
                onClick={(event) => {
                  event.stopPropagation();
                  onExclude(row.key);
                }}
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: EXCLUDE_WIDTH,
                  gap: 0.75,
                  bgcolor: 'error.dark',
                  color: 'error.contrastText',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transform: 'translateX(100%)',
                  transition: `${SLIDE}, background-color 0.15s`,
                  '&:hover': { filter: 'brightness(0.9)' },
                  '&.Mui-focusVisible': { outline: 2, outlineColor: 'error.light', outlineOffset: -4 },
                  '@media (hover: none)': {
                    width: EXCLUDE_TOUCH_WIDTH,
                    transform: 'none',
                    '& .breakdown-exclude-text': { display: 'none' }
                  }
                }}
              >
                <MinusCircleOutlined />
                <span className="breakdown-exclude-text">Exclude</span>
              </ButtonBase>
            )}
          </Box>
        );
      })}
      {hidden > 0 && (
        <Typography variant="caption" color="text.secondary">
          and {hidden} more
        </Typography>
      )}
    </Stack>
  );
}

BreakdownList.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      total: PropTypes.number.isRequired,
      published: PropTypes.number,
      rejected: PropTypes.number,
      failed: PropTypes.number
    })
  ).isRequired,
  emptyText: PropTypes.string,
  onSelect: PropTypes.func,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  maxRows: PropTypes.number,
  showRate: PropTypes.bool,
  onExclude: PropTypes.func
};
