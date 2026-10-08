import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

// project imports
import Loader from 'components/Loader';
import PlatformLogo from 'components/PlatformLogo';
import { PUBLICATION_STATUS } from 'utils/backendLabels';
import ErrorDisplay from 'components/ErrorDisplay';
import { useTrendStats } from './usePublicationStats';
import {
  PLATFORM_SERIES_ORDER,
  pickInterval,
  formatPeriod,
  hasOwnSeries,
  listPeriods,
  periodKey,
  platformLabel,
  platformSeriesColor
} from 'utils/publications';

// assets
import BarChartOutlined from '@ant-design/icons/BarChartOutlined';
import LineChartOutlined from '@ant-design/icons/LineChartOutlined';

const STORAGE_KEY = 'publicationTrendView';

// Bar width. The dates always come from the page's date filter; Day/Week/Month only choose how they're grouped.
const STEPS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' }
];
// A step is offered when it draws at least 2 and at most this many bars for the filter's range.
const MAX_PERIODS = 200;

const STEP_NOTE = {
  day: 'One bar per day (UTC).',
  week: 'One bar per week, starting Monday (UTC).',
  month: 'One bar per month (UTC).'
};
const NO_GROUPS = [];

// Remembers this viewer's last view and style; storage can be unavailable, so it's best effort.
function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      view: saved?.view === 'platform' ? 'platform' : 'status',
      style: saved?.style === 'lines' ? 'lines' : 'bars',
      step: STEPS.some((item) => item.value === saved?.step) ? saved.step : null
    };
  } catch {
    return { view: 'status', style: 'bars', step: null };
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Not saved; the chart still works.
  }
}

// Counts per period for one series key, with empty periods as 0.
function seriesData(periods, groups, interval, keyOf) {
  const byKey = new Map();
  groups.forEach((group) => {
    const key = keyOf(group);
    if (!byKey.has(key)) byKey.set(key, new Map());
    const period = periodKey(group.period, interval);
    byKey.get(key).set(period, (byKey.get(key).get(period) || 0) + group.count);
  });
  return (key) => periods.map((period) => byKey.get(key)?.get(period) || 0);
}

function LegendItem({ label, color, icon, hidden, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={!hidden}
      title={hidden ? `Show ${label}` : `Hide ${label}`}
      sx={(theme) => ({
        gap: 0.75,
        px: 1,
        py: 0.5,
        borderRadius: 1,
        border: 1,
        borderColor: hidden ? 'divider' : alpha(color, 0.5),
        bgcolor: hidden ? 'transparent' : alpha(color, theme.palette.mode === 'dark' ? 0.16 : 0.08),
        opacity: hidden ? 0.55 : 1,
        transition: 'all 0.15s'
      })}
    >
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: hidden ? 'transparent' : color, border: 2, borderColor: color }} />
      {icon}
      <Typography variant="body2" sx={{ textDecoration: hidden ? 'line-through' : 'none' }}>
        {label}
      </Typography>
    </ButtonBase>
  );
}

LegendItem.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.node,
  hidden: PropTypes.bool,
  onClick: PropTypes.func
};

// ==============================|| PUBLICATIONS OVER TIME ||============================== //

export default function PublicationTrendChart({ range, filters }) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const status = filters.status;
  const [prefs, setPrefs] = useState(loadPrefs);
  const [hidden, setHidden] = useState(() => new Set());

  const periodCount = (step) => listPeriods(range, step).length;
  const stepAllowed = (step) => periodCount(step) >= 2 && periodCount(step) <= MAX_PERIODS;
  // The remembered step if it suits this range, otherwise the one the range calls for (day, week or month).
  const step = prefs.step && stepAllowed(prefs.step) ? prefs.step : pickInterval(range);

  const { data: trend, loading, error } = useTrendStats({ range, filters, interval: step });
  // Until the new step's data arrives, keep drawing the old data with its own step and range.
  const interval = trend?.interval ?? step;
  const periodsRange = trend?.range ?? range;
  const groups = trend?.byStatus ?? NO_GROUPS;
  const platformGroups = trend?.byPlatform ?? NO_GROUPS;

  const update = (change) => {
    const next = { ...prefs, ...change };
    setPrefs(next);
    savePrefs(next);
  };
  const toggleSeries = (id) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const { labels, series } = useMemo(() => {
    const periods = listPeriods(periodsRange, interval);
    const valueFormatter = (value) => value?.toLocaleString();

    if (prefs.view === 'status') {
      const data = seriesData(periods, groups, interval, (group) => group.status);
      const list = [
        status !== 'failed' && {
          id: 'published',
          label: PUBLICATION_STATUS.published,
          color: theme.palette.success.main,
          data: data('published')
        },
        status !== 'published' && { id: 'failed', label: PUBLICATION_STATUS.failed, color: theme.palette.error.main, data: data('failed') }
      ].filter(Boolean);
      return { labels: periods.map((key) => formatPeriod(key, interval)), series: list.map((s) => ({ ...s, valueFormatter })) };
    }

    const present = new Set(platformGroups.map((group) => group.platform_name?.toLowerCase() ?? null));
    const data = seriesData(periods, platformGroups, interval, (group) =>
      hasOwnSeries(group.platform_name) ? group.platform_name.toLowerCase() : 'other'
    );
    const list = PLATFORM_SERIES_ORDER.filter((name) => present.has(name)).map((name) => ({
      id: name,
      label: platformLabel(name),
      color: platformSeriesColor(name, mode),
      data: data(name),
      platform: name
    }));
    if ([...present].some((name) => !hasOwnSeries(name))) {
      list.push({ id: 'other', label: 'Other / unknown', color: platformSeriesColor(null, mode), data: data('other') });
    }
    return { labels: periods.map((key) => formatPeriod(key, interval)), series: list.map((s) => ({ ...s, valueFormatter })) };
  }, [prefs.view, groups, platformGroups, interval, periodsRange, status, theme, mode]);

  const visible = series.filter((s) => !hidden.has(s.id));
  const empty = series.every((s) => s.data.every((value) => value === 0));
  const axisText = { fontSize: 11, fill: theme.palette.text.secondary };
  const chartProps = {
    height: 340,
    grid: { horizontal: true },
    yAxis: [{ tickLabelStyle: axisText, valueFormatter: (value) => value.toLocaleString() }],
    hideLegend: true,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
    sx: { '& .MuiChartsAxis-root line': { stroke: theme.palette.divider } }
  };

  return (
    <Box sx={{ opacity: loading && trend ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 1.5, mb: 2 }}
      >
        <ToggleButtonGroup
          size="small"
          exclusive
          value={prefs.view}
          onChange={(event, view) => {
            if (!view) return;
            setHidden(new Set());
            update({ view });
          }}
          aria-label="Split by"
        >
          <ToggleButton value="status">By status</ToggleButton>
          <ToggleButton value="platform">By platform</ToggleButton>
        </ToggleButtonGroup>
        <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={step}
            onChange={(event, value) => value && update({ step: value })}
            aria-label="Group by"
          >
            {STEPS.map((item) => {
              const allowed = stepAllowed(item.value);
              const button = (
                <ToggleButton key={item.value} value={item.value} disabled={!allowed}>
                  {item.label}
                </ToggleButton>
              );
              if (allowed) return button;
              return (
                <Tooltip
                  key={item.value}
                  title={`${periodCount(item.value) < 2 ? 'The date filter covers less than 2' : 'Too many'} ${item.value}s. Change the date filter to use it.`}
                >
                  <span>{button}</span>
                </Tooltip>
              );
            })}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={prefs.style}
            onChange={(event, style) => style && update({ style })}
            aria-label="Chart style"
          >
            <ToggleButton value="bars" aria-label="Bars" title="Stacked bars">
              <BarChartOutlined />
            </ToggleButton>
            <ToggleButton value="lines" aria-label="Lines" title="Lines">
              <LineChartOutlined />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
        {series.map((s) => {
          return (
            <LegendItem
              key={s.id}
              label={s.label}
              color={s.color}
              hidden={hidden.has(s.id)}
              onClick={() => toggleSeries(s.id)}
              icon={s.platform && <PlatformLogo name={s.platform} size={14} />}
            />
          );
        })}
      </Stack>

      {!trend && loading ? (
        <Box sx={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size={40} fullScreen={false} />
        </Box>
      ) : error && !trend ? (
        <ErrorDisplay message={error} />
      ) : empty ? (
        <Box sx={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">No publications in this period</Typography>
        </Box>
      ) : visible.length === 0 ? (
        <Box sx={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Everything is hidden. Click a legend item to show it.</Typography>
        </Box>
      ) : prefs.style === 'lines' ? (
        <LineChart
          {...chartProps}
          xAxis={[{ data: labels, scaleType: 'point', tickLabelStyle: axisText }]}
          series={visible.map(({ id, label, color, data, valueFormatter }) => ({
            id,
            label,
            color,
            data,
            valueFormatter,
            curve: 'monotoneX',
            showMark: labels.length <= 31
          }))}
          slotProps={{ tooltip: { trigger: 'axis' } }}
          sx={{ ...chartProps.sx, '& .MuiLineElement-root': { strokeWidth: 2 } }}
        />
      ) : (
        <BarChart
          {...chartProps}
          xAxis={[{ data: labels, scaleType: 'band', tickLabelStyle: axisText, categoryGapRatio: 0.3 }]}
          series={visible.map(({ id, label, color, data, valueFormatter }) => ({ id, label, color, data, valueFormatter, stack: 'total' }))}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        />
      )}

      {trend && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {STEP_NOTE[interval] || ''}
        </Typography>
      )}
    </Box>
  );
}

PublicationTrendChart.propTypes = {
  range: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired
};
