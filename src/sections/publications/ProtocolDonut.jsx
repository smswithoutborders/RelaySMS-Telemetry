import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';

// project imports
import { protocolLabel } from 'utils/publications';

const PROTOCOL_SHADES = {
  sms: { light: '#0024A8', dark: '#B5C5FF' },
  https: { light: '#577BFF', dark: '#7C97FF' },
  smtp: { light: '#8FA7FF', dark: '#3B5FE0' }
};
const OTHER_SHADE = '#8c8c8c';

const SIZE = 180;

// ==============================|| PROTOCOL SHARE ||============================== //

export default function ProtocolDonut({ rows }) {
  const theme = useTheme();
  const mode = theme.palette.mode === 'dark' ? 'dark' : 'light';
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  if (!total) return null;

  const slices = rows.map((row) => ({
    id: row.key ?? 'unknown',
    label: protocolLabel(row.key),
    value: row.total,
    color: PROTOCOL_SHADES[row.key?.toLowerCase()]?.[mode] ?? OTHER_SHADE
  }));
  const percent = (value) => `${((value / total) * 100).toFixed(1)}%`;

  return (
    <Stack direction={{ xs: 'column', sm: 'row', lg: 'column', xl: 'row' }} sx={{ alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
        <PieChart
          width={SIZE}
          height={SIZE}
          hideLegend
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          series={[
            {
              data: slices,
              innerRadius: SIZE * 0.32,
              outerRadius: SIZE * 0.48,
              paddingAngle: 2,
              cornerRadius: 4,
              valueFormatter: (item) => `${item.value.toLocaleString()} (${percent(item.value)})`,
              highlightScope: { fade: 'global', highlight: 'item' }
            }
          ]}
        />
        <Stack sx={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <Typography variant="h5">{total.toLocaleString()}</Typography>
          <Typography variant="caption" color="text.secondary">
            total
          </Typography>
        </Stack>
      </Box>

      <Stack sx={{ gap: 1, flex: 1, width: '100%', minWidth: 0 }}>
        {slices.map((slice) => (
          <Stack key={slice.id} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: slice.color, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ flex: 1 }}>
              {slice.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {percent(slice.value)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

ProtocolDonut.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, total: PropTypes.number })).isRequired
};
