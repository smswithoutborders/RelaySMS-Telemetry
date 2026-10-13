import PropTypes from 'prop-types';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// ==============================|| BREAKDOWN LIST ||============================== //

export default function BreakdownList({ rows, emptyText = 'No data in this period', onSelect, selectedKey, maxRows }) {
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
        const rate = hasStatus && row.total ? (row.published / row.total) * 100 : null;
        const selected = selectedKey !== undefined && selectedKey === row.key;
        const clickable = Boolean(onSelect) && row.key !== null;
        return (
          <Box
            key={row.key ?? '__unknown'}
            onClick={clickable ? () => onSelect(selected ? null : row.key) : undefined}
            sx={{
              cursor: clickable ? 'pointer' : 'default',
              borderRadius: 1,
              mx: -1,
              px: 1,
              py: 0.5,
              bgcolor: selected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              '&:hover': clickable ? { bgcolor: alpha(theme.palette.primary.main, 0.05) } : undefined
            }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
              {row.icon}
              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                      ? `${row.published.toLocaleString()} published · ${row.failed.toLocaleString()} failed`
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
                        {row.failed > 0 && <Box sx={{ flex: row.failed, bgcolor: 'error.main' }} />}
                      </>
                    ) : (
                      <Box sx={{ flex: 1, bgcolor: 'primary.main' }} />
                    )}
                  </Box>
                </Tooltip>
              </Box>
            </Stack>
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
      failed: PropTypes.number
    })
  ).isRequired,
  emptyText: PropTypes.string,
  onSelect: PropTypes.func,
  selectedKey: PropTypes.string,
  maxRows: PropTypes.number
};
