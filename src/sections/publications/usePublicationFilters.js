import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

// project imports
import { DEFAULT_RANGE, RANGE_PRESETS, resolveRange } from 'utils/publications';

// ==============================|| PUBLICATION FILTERS (URL) ||============================== //

const DIMENSIONS = { status: 'status', platform: 'platform_name', protocol: 'protocol', country: 'country_code' };
const RANGE_KEYS = [...RANGE_PRESETS.map((preset) => preset.key), 'custom'];
const DATE_FORMAT = 'YYYY-MM-DD';

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
    value[name] = params.get(urlKey) || '';
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
    if (value[name]) params.set(urlKey, value[name]);
  });
  return params;
}

export default function usePublicationFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const query = searchParams.toString();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterValue = useMemo(() => readFilters(searchParams), [query]);

  const setFilterValue = useCallback((next) => setSearchParams(writeFilters(next), { replace: true }), [setSearchParams]);
  const reset = useCallback(() => setSearchParams(new URLSearchParams(), { replace: true }), [setSearchParams]);
  const setDimension = useCallback(
    (name) => (next) => setFilterValue({ ...filterValue, [name]: next || '' }),
    [filterValue, setFilterValue]
  );

  const range = useMemo(
    () => resolveRange(filterValue.range, filterValue.customRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterValue.range, filterValue.customRange?.[0]?.valueOf(), filterValue.customRange?.[1]?.valueOf(), refreshKey]
  );

  const filters = {
    status: filterValue.status,
    platform_name: filterValue.platform_name,
    protocol: filterValue.protocol,
    country_code: filterValue.country_code
  };
  const listFilters = { ...filters, since: range.since, until: range.until };

  return {
    filterValue,
    setFilterValue,
    setDimension,
    reset,
    refresh: () => setRefreshKey((key) => key + 1),
    range,
    filters,
    listFilters,
    filtersKey: JSON.stringify(listFilters),
    search: query ? `?${query}` : ''
  };
}
