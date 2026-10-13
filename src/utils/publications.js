import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// project imports
import { label } from 'utils/backendLabels';

dayjs.extend(utc);
countries.registerLocale(enLocale);

// ==============================|| DATE RANGES ||============================== //

export const RANGE_PRESETS = [
  { key: '24h', label: 'Last 24 hours', amount: 24, unit: 'hour' },
  { key: '7d', label: 'Last 7 days', amount: 7, unit: 'day' },
  { key: '30d', label: 'Last 30 days', amount: 30, unit: 'day' },
  { key: '90d', label: 'Last 90 days', amount: 90, unit: 'day' },
  { key: '12m', label: 'Last 12 months', amount: 12, unit: 'month' }
];

export const DEFAULT_RANGE = '30d';

// Returns { since, until } as dayjs objects; custom ranges include the whole end day.
export function resolveRange(rangeKey, customRange) {
  if (rangeKey === 'custom' && customRange?.[0] && customRange?.[1]) {
    return { since: customRange[0].startOf('day'), until: customRange[1].add(1, 'day').startOf('day') };
  }
  const preset = RANGE_PRESETS.find((item) => item.key === rangeKey) || RANGE_PRESETS.find((item) => item.key === DEFAULT_RANGE);
  const until = dayjs();
  return { since: until.subtract(preset.amount, preset.unit), until };
}

// The window of the same length just before this one, for period-over-period change.
export function previousRange({ since, until }) {
  const length = until.diff(since);
  return { since: since.subtract(length, 'millisecond'), until: since };
}

export function rangeLabel(rangeKey, customRange) {
  if (rangeKey === 'custom' && customRange?.[0] && customRange?.[1]) {
    return `${customRange[0].format('MMM D, YYYY')} – ${customRange[1].format('MMM D, YYYY')}`;
  }
  return RANGE_PRESETS.find((item) => item.key === rangeKey)?.label || '';
}

// Keeps a chart between roughly 7 and 90 bars.
export function pickInterval({ since, until }) {
  const days = until.diff(since, 'day', true);
  if (days <= 92) return 'day';
  if (days <= 550) return 'week';
  return 'month';
}

// Period starts in UTC, matching the API's buckets (weeks start Monday).
// Steps are UTC, like the Publisher's buckets.
function periodStart(value, interval) {
  const date = dayjs.utc(value).startOf('day');
  if (interval === 'week') return date.subtract((date.day() + 6) % 7, 'day');
  if (interval === 'month') return date.startOf('month');
  if (interval === 'year') return date.startOf('year');
  return date;
}

export function periodKey(value, interval) {
  return periodStart(value, interval).format('YYYY-MM-DD');
}

export function listPeriods({ since, until }, interval) {
  const periods = [];
  let cursor = periodStart(since, interval);
  const end = dayjs.utc(until);
  while (cursor.isBefore(end) && periods.length < 1000) {
    periods.push(cursor.format('YYYY-MM-DD'));
    cursor = cursor.add(1, interval);
  }
  return periods;
}

export function formatPeriod(key, interval) {
  const date = dayjs.utc(key);
  if (interval === 'month') return date.format('MMM YYYY');
  if (interval === 'year') return date.format('YYYY');
  if (interval === 'week') return `Week of ${date.format('MMM D')}`;
  return date.format('MMM D');
}

export function percentChange(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

// ==============================|| DISPLAY ||============================== //

export function countryName(code) {
  if (!code) return 'Unknown';
  const upper = code.toUpperCase();
  return countries.isValid(upper) ? countries.getName(upper, 'en') : upper;
}

export function countryFlag(code) {
  if (!code || !countries.isValid(code.toUpperCase())) return '';
  return code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt()));
}

const PLATFORM_SERIES = {
  telegram: { light: '#2a78d6', dark: '#3987e5' },
  gmail: { light: '#eb6834', dark: '#d95926' },
  bluesky: { light: '#1baf7a', dark: '#199e70' },
  slack: { light: '#eda100', dark: '#c98500' },
  mastodon: { light: '#e87ba4', dark: '#d55181' },
  twitter: { light: '#4a3aa7', dark: '#9085e9' },
  x: { light: '#4a3aa7', dark: '#9085e9' }
};
export const PLATFORM_SERIES_ORDER = ['telegram', 'gmail', 'bluesky', 'slack', 'mastodon', 'twitter', 'x'];
export const OTHER_SERIES_COLOR = { light: '#8c8c8c', dark: '#8c8c8c' };

export function platformSeriesColor(name, mode) {
  return (PLATFORM_SERIES[name?.toLowerCase()] || OTHER_SERIES_COLOR)[mode === 'dark' ? 'dark' : 'light'];
}

export function hasOwnSeries(name) {
  return Boolean(PLATFORM_SERIES[name?.toLowerCase()]);
}

// Display names come from utils/backendLabels, the one place that maps backend values to words.
export function platformLabel(name) {
  return label.platform(name);
}

export function protocolLabel(name) {
  return label.protocol(name);
}
