import { useCallback, useEffect, useState } from 'react';

// project imports
import { getErrorMessage } from 'api/admin';
import { getPublicationSummary } from 'api/publisher';
import { previousRange } from 'utils/publications';

// ==============================|| PUBLICATION STATS ||============================== //

function countByStatus(groups) {
  const totals = { total: 0, published: 0, failed: 0 };
  groups.forEach(({ status, count }) => {
    totals.total += count;
    if (status === 'published') totals.published += count;
    else if (status === 'failed') totals.failed += count;
  });
  return totals;
}

export function foldByStatus(groups, key) {
  const rows = new Map();
  groups.forEach((group) => {
    const id = group[key] ?? null;
    const row = rows.get(id) || { key: id, total: 0, published: 0, failed: 0 };
    row.total += group.count;
    if (group.status === 'published') row.published += group.count;
    else if (group.status === 'failed') row.failed += group.count;
    rows.set(id, row);
  });
  return [...rows.values()].sort((a, b) => b.total - a.total);
}

export default function usePublicationStats({ range, filters, withReasons }) {
  const [state, setState] = useState({ loading: true, error: '', data: null });
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  const sinceMs = range.since.valueOf();
  const untilMs = range.until.valueOf();

  useEffect(() => {
    const controller = new AbortController();
    const config = { signal: controller.signal };
    const current = { ...filters, since: range.since, until: range.until };
    const previous = { ...filters, ...previousRange(range) };

    setState((prev) => ({ ...prev, loading: true, error: '' }));

    Promise.all([
      getPublicationSummary({ groupBy: ['status'], filters: current }, config),
      getPublicationSummary({ groupBy: ['status'], filters: previous }, config),
      getPublicationSummary({ groupBy: ['platform_name', 'status'], filters: current }, config),
      getPublicationSummary({ groupBy: ['protocol', 'status'], filters: current }, config),
      getPublicationSummary({ groupBy: ['country_code'], filters: current }, config),
      withReasons && filters.status !== 'published'
        ? getPublicationSummary({ groupBy: ['failure_reason'], filters: { ...current, status: 'failed' } }, config)
        : Promise.resolve(null)
    ])
      .then(([totals, previousTotals, platforms, protocols, countries, reasons]) => {
        setState({
          loading: false,
          error: '',
          data: {
            totals: countByStatus(totals.groups),
            previousTotals: countByStatus(previousTotals.groups),
            platforms: foldByStatus(platforms.groups, 'platform_name'),
            protocols: foldByStatus(protocols.groups, 'protocol'),
            countries: countries.groups,
            reasons: reasons?.groups ?? null
          }
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({ ...prev, loading: false, error: getErrorMessage(error, "We couldn't load publication stats.") }));
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sinceMs, untilMs, filters.status, filters.platform_name, filters.protocol, filters.country_code, withReasons, reloadKey]);

  return { ...state, reload };
}

export function useTrendStats({ range, filters, interval }) {
  const [state, setState] = useState({ loading: true, error: '', data: null });
  const sinceMs = range.since.valueOf();
  const untilMs = range.until.valueOf();

  useEffect(() => {
    const controller = new AbortController();
    const config = { signal: controller.signal };
    const current = { ...filters, since: range.since, until: range.until };
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    const request = Promise.all([
      getPublicationSummary({ groupBy: ['status'], interval, filters: current }, config),
      getPublicationSummary({ groupBy: ['platform_name'], interval, filters: current }, config)
    ]).then(([byStatus, byPlatform]) => ({ byStatus: byStatus.groups, byPlatform: byPlatform.groups }));
    request
      .then((result) =>
        setState({ loading: false, error: '', data: { interval, range: { since: range.since, until: range.until }, ...result } })
      )
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({ ...prev, loading: false, error: getErrorMessage(error, "We couldn't load the chart.") }));
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sinceMs, untilMs, interval, filters.status, filters.platform_name, filters.protocol, filters.country_code]);

  return state;
}

export function useFilterOptions(range) {
  const [options, setOptions] = useState({ platforms: [], protocols: [], countries: [] });
  const sinceMs = range.since.valueOf();
  const untilMs = range.until.valueOf();

  useEffect(() => {
    const controller = new AbortController();
    getPublicationSummary(
      { groupBy: ['platform_name', 'protocol', 'country_code'], filters: { since: range.since, until: range.until } },
      { signal: controller.signal }
    )
      .then(({ groups }) => {
        const distinct = (key) => [...new Set(groups.map((group) => group[key]).filter(Boolean))].sort();
        setOptions({ platforms: distinct('platform_name'), protocols: distinct('protocol'), countries: distinct('country_code') });
      })
      .catch(() => {});
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sinceMs, untilMs]);

  return options;
}
