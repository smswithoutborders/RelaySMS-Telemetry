import PropTypes from 'prop-types';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// antd
import { Button, DatePicker, Input, Select, Space } from 'antd';
import { ReloadOutlined, UserOutlined } from '@ant-design/icons';

// project imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import ErrorDisplay from 'components/ErrorDisplay';
import { useAuth } from 'contexts/AuthContext';
import { getErrorMessage } from 'api/admin';
import { listAuditEvents } from 'api/publisher';
import { RANGE_PRESETS } from 'utils/publications';
import { SCOPES } from 'utils/scopes';
import { AUDIT_ACTIONS, AUDIT_AREAS, OUTCOMES, actionArea, actionLabel, describeDetails, targetIsUser } from 'utils/audit';

// assets
import DownOutlined from '@ant-design/icons/DownOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';

dayjs.extend(relativeTime);

const PAGE_SIZES = [25, 50, 100, 200];
const RANGES = [...RANGE_PRESETS, { key: 'all', label: 'All time' }];
const DATE_FORMAT = 'YYYY-MM-DD';

// ==============================|| FILTERS (URL) ||============================== //

function useLogFilters() {
  const [params, setParams] = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const query = params.toString();

  const value = useMemo(() => {
    const range = [...RANGES.map((r) => r.key), 'custom'].includes(params.get('range')) ? params.get('range') : 'all';
    const from = dayjs(params.get('from'));
    const to = dayjs(params.get('to'));
    return {
      range,
      customRange: range === 'custom' && from.isValid() && to.isValid() ? [from, to] : null,
      action: AUDIT_ACTIONS[params.get('action')] ? params.get('action') : '',
      actor: params.get('actor') || '',
      target: params.get('target') || ''
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const setValue = (next) => {
    const out = new URLSearchParams();
    if (next.range !== 'all') out.set('range', next.range);
    if (next.range === 'custom' && next.customRange) {
      out.set('from', next.customRange[0].format(DATE_FORMAT));
      out.set('to', next.customRange[1].format(DATE_FORMAT));
    }
    ['action', 'actor', 'target'].forEach((key) => next[key] && out.set(key, next[key]));
    setParams(out, { replace: true });
  };

  // Presets are relative to now; re-anchor them on refresh.
  const filters = useMemo(() => {
    let since;
    let until;
    if (value.range === 'custom' && value.customRange) {
      since = value.customRange[0].startOf('day');
      until = value.customRange[1].add(1, 'day').startOf('day');
    } else {
      const preset = RANGE_PRESETS.find((r) => r.key === value.range);
      if (preset) {
        until = dayjs();
        since = until.subtract(preset.amount, preset.unit);
      }
    }
    return { since, until, action: value.action, actor: value.actor, target: value.target };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, refreshKey]);

  return {
    value,
    setValue,
    filters,
    refresh: () => setRefreshKey((key) => key + 1),
    reset: () => setParams(new URLSearchParams(), { replace: true })
  };
}

// Commits typed text after a pause, so each keystroke doesn't reload the table.
function DebouncedInput({ value, onCommit, ...props }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  useEffect(() => {
    if (text === value) return undefined;
    const timer = setTimeout(() => onCommit(text.trim()), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return <Input {...props} value={text} onChange={(event) => setText(event.target.value)} allowClear />;
}

DebouncedInput.propTypes = { value: PropTypes.string, onCommit: PropTypes.func };

// ==============================|| CELLS ||============================== //

// A username that opens that user on the Users page, for viewers who can see users.
function UserLink({ username, canOpen }) {
  if (!canOpen) return <span>{username}</span>;
  return (
    <Tooltip title="Show in Users">
      <Link component={RouterLink} to={`/users?user=${encodeURIComponent(username)}`} underline="hover" sx={{ fontWeight: 500 }}>
        {username}
      </Link>
    </Tooltip>
  );
}

UserLink.propTypes = { username: PropTypes.string, canOpen: PropTypes.bool };

function OutcomeChip({ outcome }) {
  const info = OUTCOMES[outcome] || { label: outcome, color: 'secondary.main' };
  return <Chip size="small" label={info.label} sx={{ bgcolor: info.color, color: '#fff', fontWeight: 500 }} />;
}

OutcomeChip.propTypes = { outcome: PropTypes.string };

function EventRow({ event, canOpenUsers }) {
  const [open, setOpen] = useState(false);
  const summary = describeDetails(event);
  const hasDetails = event.details && Object.keys(event.details).length > 0;
  const area = AUDIT_AREAS.find((a) => a.id === actionArea(event.action));

  return (
    <Fragment>
      <TableRow hover sx={{ '& > td': { borderBottom: open ? 'none' : undefined } }}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title={dayjs(event.occurred_at).format('MMM D, YYYY HH:mm:ss')}>
            <span>{dayjs(event.occurred_at).fromNow()}</span>
          </Tooltip>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {event.actor ? (
            <UserLink username={event.actor} canOpen={canOpenUsers} />
          ) : (
            <Tooltip
              title={
                event.action === 'auth.login'
                  ? 'Nobody was signed in: a failed sign-in attempt'
                  : 'Done on the server with the command line'
              }
            >
              <Typography variant="body2" color="text.secondary" component="span" sx={{ cursor: 'help' }}>
                {event.action === 'auth.login' ? 'Unknown' : 'Command line'}
              </Typography>
            </Tooltip>
          )}
        </TableCell>
        <TableCell>
          <Stack sx={{ gap: 0.25 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {actionLabel(event)}
            </Typography>
            {area && (
              <Typography variant="caption" color="text.secondary">
                {area.label}
              </Typography>
            )}
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {event.target ? (
            targetIsUser(event.action) ? (
              <UserLink username={event.target} canOpen={canOpenUsers} />
            ) : (
              event.target
            )
          ) : (
            <Typography variant="body2" color="text.secondary" component="span">
              —
            </Typography>
          )}
        </TableCell>
        <TableCell>
          <OutcomeChip outcome={event.outcome} />
        </TableCell>
        <TableCell sx={{ maxWidth: 360 }}>
          <Typography variant="body2" color="text.secondary" noWrap title={summary}>
            {summary || '—'}
          </Typography>
        </TableCell>
        <TableCell align="right" sx={{ width: 48 }}>
          {hasDetails && (
            <IconButton size="small" aria-label={open ? 'Hide details' : 'Show details'} onClick={() => setOpen((prev) => !prev)}>
              <DownOutlined style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      {hasDetails && (
        <TableRow>
          <TableCell colSpan={7} sx={{ py: 0 }}>
            <Collapse in={open} unmountOnExit>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  fontSize: '0.8125rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto'
                }}
              >
                {JSON.stringify(event.details, null, 2)}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}

EventRow.propTypes = { event: PropTypes.object.isRequired, canOpenUsers: PropTypes.bool };

// ==============================|| LOGS ||============================== //

export default function Logs() {
  const { hasScope } = useAuth();
  const canOpenUsers = hasScope(SCOPES.CREDS_READ);
  const visibleAreas = AUDIT_AREAS.filter((area) => hasScope(area.id === 'platforms' ? SCOPES.PLATFORMS_READ : SCOPES.CREDS_READ));
  const { value, setValue, filters, refresh, reset } = useLogFilters();

  const [limit, setLimit] = useState(50);
  const [cursorFor, setCursorFor] = useState({ query: '', cursor: null });
  const [page, setPage] = useState({ data: [], nextCursor: null, prevCursor: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const query = `${JSON.stringify(filters)}|${limit}`;
  const cursor = cursorFor.query === query ? cursorFor.cursor : null;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    listAuditEvents({ filters, limit, cursor }, { signal: controller.signal })
      .then((result) => {
        setPage(result);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(err, "We couldn't load the logs."));
        setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, cursor, reloadKey]);

  const set = (key) => (next) => setValue({ ...value, [key]: next || '' });
  const filtered = Boolean(value.action || value.actor || value.target || value.range !== 'all');

  return (
    <Grid container rowSpacing={3} columnSpacing={2.75}>
      <Grid size={12}>
        <Typography variant="h5">Logs</Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Who signed in and what changed, newest first. You see {visibleAreas.map((a) => a.label.toLowerCase()).join(' and ') || 'no areas'}
          {visibleAreas.length < AUDIT_AREAS.length ? ', the areas your permissions cover' : ''}.
        </Typography> */}
      </Grid>

      <Grid size={12}>
        <MainCard contentSX={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Space wrap size="middle">
            <Select
              value={value.range}
              onChange={(range) => setValue({ ...value, range })}
              style={{ width: 170 }}
              options={[...RANGES.map(({ key, label }) => ({ value: key, label })), { value: 'custom', label: 'Custom range' }]}
            />
            {value.range === 'custom' && (
              <DatePicker.RangePicker
                value={value.customRange}
                onChange={(customRange) => setValue({ ...value, customRange })}
                disabledDate={(date) => date.isAfter(new Date())}
                allowClear={false}
              />
            )}
            <Select
              placeholder="Action"
              value={value.action || undefined}
              onChange={set('action')}
              allowClear
              style={{ width: 230 }}
              options={visibleAreas.map((area) => ({
                label: area.label,
                options: Object.entries(AUDIT_ACTIONS)
                  .filter(([, info]) => info.area === area.id)
                  .map(([key, info]) => ({ value: key, label: info.label }))
              }))}
            />
            <DebouncedInput
              placeholder="Done by (username)"
              prefix={<UserOutlined />}
              value={value.actor}
              onCommit={set('actor')}
              style={{ width: 200 }}
            />
            <DebouncedInput placeholder="Done to (user or platform)" value={value.target} onCommit={set('target')} style={{ width: 220 }} />
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={() => {
                refresh();
                setReloadKey((key) => key + 1);
              }}
            >
              Refresh
            </Button>
            {filtered && (
              <Button type="link" onClick={reset}>
                Reset filters
              </Button>
            )}
          </Space>
        </MainCard>
      </Grid>

      <Grid size={12}>
        <MainCard content={false}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>When</TableCell>
                  <TableCell>Done by</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Done to</TableCell>
                  <TableCell>Outcome</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ border: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <Loader size={40} fullScreen={false} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ border: 0 }}>
                      <ErrorDisplay message={error} onRetry={() => setReloadKey((key) => key + 1)} />
                    </TableCell>
                  </TableRow>
                ) : page.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ border: 0 }}>
                      <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                        {filtered ? 'No events match these filters' : 'Nothing has been logged yet'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  page.data.map((event) => <EventRow key={event.id} event={event} canOpenUsers={canOpenUsers} />)
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end', gap: 2, py: 1.5, px: 2 }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Rows per page
              </Typography>
              <MuiSelect size="small" value={limit} onChange={(event) => setLimit(event.target.value)} variant="standard" disableUnderline>
                {PAGE_SIZES.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </MuiSelect>
            </Stack>
            <IconButton
              aria-label="Newer events"
              disabled={loading || !page.prevCursor}
              onClick={() => setCursorFor({ query, cursor: page.prevCursor })}
            >
              <LeftOutlined />
            </IconButton>
            <IconButton
              aria-label="Older events"
              disabled={loading || !page.nextCursor}
              onClick={() => setCursorFor({ query, cursor: page.nextCursor })}
            >
              <RightOutlined />
            </IconButton>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
