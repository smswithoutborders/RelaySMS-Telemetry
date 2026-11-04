import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

// project imports
import { DEFAULT_RANGE, RANGE_PRESETS, resolveRange } from 'utils/publications';

// ==============================|| PUBLICATION FILTERS (URL) ||============================== //

const DIMENSIONS = {
  status: 'status',
  platform: 'platform_name',
  protocol: 'protocol',
  country: 'country_code',
  exclude: 'exclude_country_code'
};
const UPPERCASE = ['country_code', 'exclude_country_code'];
const RANGE_KEYS = [...RANGE_PRESETS.map((preset) => preset.key), 'custom'];
const DATE_FORMAT = 'YYYY-MM-DD';
// How long to wait after the last filter change before fetching, so picking several values in a row costs one fetch.
const APPLY_DELAY_MS = 400;

function readFilters(params) {
  let range = params.get('range');
  if (!RANGE_KEYS.includes(range)) range = DEFAULT_RANGE;

  let customRange = null;
  if (range === 'custom') {
    const from = dayjs(params.get('from'));
    const to = dayjs(params.get('to'));
    if (from.isValid() && to.isValid() && !from.isAfter(to)) customRange = [from, to];
  }

  const value = { range, customRange };
  Object.entries(DIMENSIONS).forEach(([urlKey, name]) => {
    const list = (params.get(urlKey) || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => (UPPERCASE.includes(name) ? item.toUpperCase() : item));
    value[name] = [...new Set(list)];
  });
  return value;
}

function writeFilters(value) {
  const params = new URLSearchParams();
  if (value.range !== DEFAULT_RANGE) params.set('range', value.range);
  if (value.range === 'custom' && value.customRange?.[0] && value.customRange?.[1]) {
    params.set('from', value.customRange[0].format(DATE_FORMAT));
    params.set('to', value.customRange[1].format(DATE_FORMAT));
  }
  Object.entries(DIMENSIONS).forEach(([urlKey, name]) => {
    if (value[name]?.length) params.set(urlKey, value[name].join(','));
  });
  return params;
}

export default function usePublicationFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const query = searchParams.toString();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterValue = useMemo(() => readFilters(searchParams), [query]);

  const [appliedQuery, setAppliedQuery] = useState(query);
  useEffect(() => {
    if (query === appliedQuery) return undefined;
    const timer = setTimeout(() => setAppliedQuery(query), APPLY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query, appliedQuery]);
  const pending = query !== appliedQuery;
  const applied = useMemo(() => readFilters(new URLSearchParams(appliedQuery)), [appliedQuery]);

  const setFilterValue = useCallback((next) => setSearchParams(writeFilters(next), { replace: true }), [setSearchParams]);
  const reset = useCallback(() => setSearchParams(new URLSearchParams(), { replace: true }), [setSearchParams]);
  const setDimension = useCallback(
    (name) => (item) => {
      if (item === null || item === undefined) return;
      const list = filterValue[name];
      setFilterValue({ ...filterValue, [name]: list.includes(item) ? list.filter((other) => other !== item) : [...list, item] });
    },
    [filterValue, setFilterValue]
  );
  const excludeCountry = useCallback(
    (code) => {
      if (!code || filterValue.exclude_country_code.includes(code)) return;
      setFilterValue({
        ...filterValue,
        country_code: filterValue.country_code.filter((other) => other !== code),
        exclude_country_code: [...filterValue.exclude_country_code, code]
      });
    },
    [filterValue, setFilterValue]
  );

  const range = useMemo(
    () => resolveRange(applied.range, applied.customRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applied.range, applied.customRange?.[0]?.valueOf(), applied.customRange?.[1]?.valueOf(), refreshKey]
  );

  // Kept the same object until the applied filters change, so effects and memos that use it don't rerun.
  const filters = useMemo(
    () => ({
      status: applied.status,
      platform_name: applied.platform_name,
      protocol: applied.protocol,
      country_code: applied.country_code,
      exclude_country_code: applied.exclude_country_code
    }),
    [applied]
  );
  const listFilters = useMemo(() => ({ ...filters, since: range.since, until: range.until }), [filters, range]);

  return {
    filterValue,
    setFilterValue,
    setDimension,
    excludeCountry,
    // True between a filter change and when the data starts following it.
    pending,
    reset,
    refresh: () => setRefreshKey((key) => key + 1),
    range,
    filters,
    listFilters,
    filtersKey: JSON.stringify(listFilters),
    search: query ? `?${query}` : ''
  };
}
