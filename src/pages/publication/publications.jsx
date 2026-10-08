import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiButton from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// antd
import { Button } from 'antd';

// project imports
import MainCard from 'components/MainCard';
import PlatformLogo from 'components/PlatformLogo';
import { NO_PLATFORM, label } from 'utils/backendLabels';
import CountryFlag from 'components/CountryFlag';
import Loader from 'components/Loader';
import ErrorDisplay from 'components/ErrorDisplay';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import SummaryRow from 'components/cards/SummaryRow';
import { useAuth } from 'contexts/AuthContext';
import { SCOPES } from 'utils/scopes';
import { countryName, percentChange, platformLabel, previousRange, protocolLabel, rangeLabel } from 'utils/publications';
import usePublicationStats, { useFilterOptions } from 'sections/publications/usePublicationStats';
import usePublicationFilters from 'sections/publications/usePublicationFilters';
import PublicationFilters from 'sections/publications/PublicationFilters';
import PublicationTrendChart from 'sections/publications/PublicationTrendChart';
import PublicationMap from 'sections/publications/PublicationMap';
import PublicationTable from 'sections/publications/PublicationTable';
import BreakdownList from 'sections/publications/BreakdownList';
import ProtocolDonut from 'sections/publications/ProtocolDonut';

// assets
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';

const PREVIEW_ROWS = 8;

// Tooltip body for a total: what it counts, then how its trend is worked out with the numbers on screen.
function TileHelp({ what, steps }) {
  return (
    <Box sx={{ py: 0.5, maxWidth: 300 }}>
      <Typography variant="body2" sx={{ mb: steps?.length ? 1 : 0 }}>
        {what}
      </Typography>
      {steps?.map((step) => (
        <Typography key={step} variant="caption" sx={{ display: 'block', fontVariantNumeric: 'tabular-nums' }}>
          {step}
        </Typography>
      ))}
    </Box>
  );
}

TileHelp.propTypes = { what: PropTypes.string, steps: PropTypes.arrayOf(PropTypes.string) };

const fmt = (n) => n.toLocaleString();

// How a count changed, in words, e.g. "1,200 now vs 1,000 before: up 20.0%".
function changeSteps(value, previous, previousLabel) {
  if (!previous) return [`Nothing in ${previousLabel} to compare with.`];
  const change = ((value - previous) / previous) * 100;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'no change';
  return [
    `Now: ${fmt(value)}. Before (${previousLabel}): ${fmt(previous)}.`,
    `(${fmt(value)} − ${fmt(previous)}) ÷ ${fmt(previous)} = ${direction}${change ? ` ${Math.abs(change).toFixed(1)}%` : ''}`
  ];
}

function ChangeTile({ title, value, previous, extra, increaseIsBad = false, info }) {
  const change = percentChange(value, previous);
  const rounded = change === null ? null : Math.round(Math.abs(change) * 10) / 10;
  return (
    <AnalyticEcommerce
      title={title}
      count={value.toLocaleString()}
      percentage={rounded || null}
      isLoss={change !== null && (increaseIsBad ? change > 0 : change < 0)}
      extra={extra}
      info={info}
    />
  );
}

ChangeTile.propTypes = {
  title: PropTypes.string,
  value: PropTypes.number,
  previous: PropTypes.number,
  extra: PropTypes.string,
  increaseIsBad: PropTypes.bool,
  info: PropTypes.node
};

// ==============================|| PUBLICATIONS OVERVIEW ||============================== //

export default function Publications() {
  const { hasScope } = useAuth();
  const withReasons = hasScope(SCOPES.STATS_REASONS);

  const { filterValue, setFilterValue, setDimension, reset, refresh, range, filters, listFilters, filtersKey, search } =
    usePublicationFilters();

  const { data, loading, error, reload } = usePublicationStats({ range, filters, withReasons });
  const options = useFilterOptions(range);
  const isDarkMode = useTheme().palette.mode === 'dark';
  const logLink = `/publications/log${search}`;

  const totals = data?.totals;
  const previousTotals = data?.previousTotals;
  const successRate = totals?.total ? (totals.published / totals.total) * 100 : null;
  const previousRate = previousTotals?.total ? (previousTotals.published / previousTotals.total) * 100 : null;
  const rateDelta = successRate !== null && previousRate !== null ? successRate - previousRate : null;
  // "the previous 30 days, Aug 3 – Sep 2": the window the trends compare against.
  const before = previousRange(range);
  const previousLabel = `${before.since.format('MMM D')} – ${before.until.subtract(1, 'minute').format('MMM D')}`;

  const countryRows = (data?.countries || [])
    .map(({ country_code: code, count }) => ({
      key: code,
      label: code ? countryName(code) : 'Unknown',
      icon: <CountryFlag code={code} />,
      total: count
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <Grid container rowSpacing={3} columnSpacing={2.75}>
      <Grid size={12}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1 }}>
          <Box>
            <Typography variant="h5">Publication Overview</Typography>
            <Typography variant="body2" color="text.secondary">
              How publishing through RelaySMS is going, {rangeLabel(filterValue.range, filterValue.customRange).toLowerCase()}
            </Typography>
          </Box>
          <MuiButton component={RouterLink} to={logLink} endIcon={<ArrowRightOutlined />}>
            Open publication log
          </MuiButton>
        </Stack>
      </Grid>

      <Grid size={12}>
        <PublicationFilters
          value={filterValue}
          options={options}
          onChange={setFilterValue}
          onReset={reset}
          onRefresh={() => {
            refresh();
            reload();
          }}
        />
      </Grid>

      {error && !data ? (
        <Grid size={12}>
          <MainCard>
            <ErrorDisplay message={error} onRetry={reload} />
          </MainCard>
        </Grid>
      ) : !data ? (
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <Loader size={50} fullScreen={false} />
          </Box>
        </Grid>
      ) : (
        <>
          {error && (
            <Grid size={12}>
              <Alert severity="error" action={<Button onClick={reload}>Retry</Button>}>
                {error}
              </Alert>
            </Grid>
          )}

          <Grid size={12}>
            <SummaryRow sx={{ opacity: loading ? 0.6 : 1 }}>
              <ChangeTile
                title="Publications"
                value={totals.total}
                previous={previousTotals.total}
                extra="vs previous period"
                info={
                  <TileHelp
                    what="Every publish attempt in the selected dates and filters, published or failed."
                    steps={changeSteps(totals.total, previousTotals.total, previousLabel)}
                  />
                }
              />
              <ChangeTile
                title="Published"
                value={totals.published}
                previous={previousTotals.published}
                extra="Delivered to the platform"
                info={
                  <TileHelp
                    what="Attempts the platform accepted, so the message went out."
                    steps={changeSteps(totals.published, previousTotals.published, previousLabel)}
                  />
                }
              />
              <ChangeTile
                title="Failed"
                value={totals.failed}
                previous={previousTotals.failed}
                extra="Did not publish"
                increaseIsBad
                info={
                  <TileHelp
                    what="Attempts that didn't reach the platform. More failures is bad, so a rise shows in red."
                    steps={changeSteps(totals.failed, previousTotals.failed, previousLabel)}
                  />
                }
              />
              <AnalyticEcommerce
                title="Success rate"
                count={successRate === null ? '—' : `${successRate.toFixed(1)}%`}
                extra={
                  rateDelta === null
                    ? 'No earlier data to compare'
                    : `${rateDelta >= 0 ? '+' : '−'}${Math.abs(rateDelta).toFixed(1)} pts vs previous period`
                }
                info={
                  <TileHelp
                    what="Out of every 100 attempts, how many were published. Published ÷ all attempts × 100."
                    steps={[
                      successRate === null
                        ? 'No attempts in these dates yet.'
                        : `Now: ${fmt(totals.published)} ÷ ${fmt(totals.total)} = ${successRate.toFixed(1)}%`,
                      previousRate === null
                        ? `Before (${previousLabel}): no attempts to compare with.`
                        : `Before (${previousLabel}): ${fmt(previousTotals.published)} ÷ ${fmt(previousTotals.total)} = ${previousRate.toFixed(1)}%`,
                      ...(rateDelta === null
                        ? []
                        : [
                            `Change: ${successRate.toFixed(1)} − ${previousRate.toFixed(1)} = ${rateDelta >= 0 ? '+' : '−'}${Math.abs(rateDelta).toFixed(1)} pts`,
                            '"pts" are percentage points: the plain difference between the two rates.'
                          ])
                    ]}
                  />
                }
              />
            </SummaryRow>
          </Grid>

          <Grid size={12}>
            <MainCard
              title="Latest publications"
              content={false}
              secondary={
                <MuiButton size="small" component={RouterLink} to={logLink} endIcon={<ArrowRightOutlined />}>
                  View all
                </MuiButton>
              }
            >
              <Box sx={{ p: 1.5 }}>
                <PublicationTable filters={listFilters} filtersKey={filtersKey} withReasons={withReasons} preview={PREVIEW_ROWS} />
              </Box>
            </MainCard>
          </Grid>

          <Grid size={12}>
            <MainCard title="Countries" sx={{ opacity: loading ? 0.6 : 1 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 7, lg: 8.5 }} sx={{ height: { xs: 320, sm: 420 } }}>
                  <PublicationMap
                    data={data.countries}
                    selectedCountry={filters.country_code || null}
                    onCountrySelect={setDimension('country_code')}
                    onRetry={reload}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5, lg: 3.5 }} sx={{ maxHeight: 420, overflowY: 'auto', overflowX: 'hidden', px: 1 }}>
                  <BreakdownList
                    rows={countryRows}
                    selectedKey={filters.country_code || undefined}
                    onSelect={setDimension('country_code')}
                  />
                </Grid>
              </Grid>
            </MainCard>
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <MainCard title="Publications over time" sx={{ height: '100%', opacity: loading ? 0.6 : 1 }}>
              <PublicationTrendChart range={range} filters={filters} />
            </MainCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <MainCard title="Protocols" sx={{ height: '100%', opacity: loading ? 0.6 : 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                How messages reached the Publisher. Click one to filter.
              </Typography>
              <BreakdownList
                rows={data.protocols.map((row) => ({ ...row, label: protocolLabel(row.key) }))}
                selectedKey={filters.protocol || undefined}
                onSelect={setDimension('protocol')}
              />
              {data.protocols.length > 0 && (
                <>
                  <Divider sx={{ my: 2.5 }} />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Share of publications
                  </Typography>
                  <ProtocolDonut rows={data.protocols} />
                </>
              )}
            </MainCard>
          </Grid>

          <Grid size={{ xs: 12, lg: withReasons ? 6 : 12 }}>
            <MainCard title="Platforms" sx={{ height: '100%', opacity: loading ? 0.6 : 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Publications per platform, split into published and failed. Click one to filter.
              </Typography>
              <BreakdownList
                rows={data.platforms.map((row) => ({
                  ...row,
                  label: row.key ? platformLabel(row.key) : NO_PLATFORM.long,
                  icon: <PlatformLogo name={row.key} tile />
                }))}
                selectedKey={filters.platform_name || undefined}
                onSelect={setDimension('platform_name')}
              />
            </MainCard>
          </Grid>
          {withReasons && (
            <Grid size={{ xs: 12, lg: 6 }}>
              <MainCard title="Failure reasons" sx={{ height: '100%', opacity: loading ? 0.6 : 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Why failed publications didn&apos;t go through.
                </Typography>
                <BreakdownList
                  rows={(data.reasons || []).map(({ failure_reason: reason, count }) => ({
                    key: reason,
                    label: label.failureReason(reason),
                    total: count
                  }))}
                  emptyText={filters.status === 'published' ? 'Clear the Published filter to see failures' : 'No failures in this period'}
                  maxRows={12}
                />
              </MainCard>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
}
