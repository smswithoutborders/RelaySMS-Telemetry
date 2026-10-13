import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import countries from 'i18n-iso-countries';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiButton from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

// antd
import { Button, Input, Select, Space } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';

// project imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import ErrorDisplay from 'components/ErrorDisplay';
import GatewayClientDialog from 'sections/gateway-clients/GatewayClientDialog';
import { ConfirmDialog } from 'sections/credentials/CredentialDialogs';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useAuth } from 'contexts/AuthContext';
import { getErrorMessage } from 'api/admin';
import {
  createGatewayClient,
  deleteGatewayClient,
  getGatewayClient,
  listGatewayClientRegistry,
  listGatewayClients,
  updateGatewayClient
} from 'api/publisher';
import { SCOPES } from 'utils/scopes';
import { GATEWAY_CLIENT_STATUS } from 'utils/backendLabels';
import { countryFlag, protocolLabel } from 'utils/publications';

dayjs.extend(relativeTime);

// assets
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import StopOutlined from '@ant-design/icons/StopOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

// Turns an API error into an Error whose message is fit to show.
async function attempt(promise, fallback) {
  try {
    return await promise;
  } catch (error) {
    // 412: the number changed after this dialog loaded it (If-Match no longer matches).
    if (error.response?.status === 412) {
      const conflict = new Error('Someone else changed this number while you had this open. Close it to see their change, then try again.');
      conflict.conflict = true;
      throw conflict;
    }
    throw new Error(getErrorMessage(error, fallback));
  }
}

const STATUS_OPTIONS = Object.entries(GATEWAY_CLIENT_STATUS).map(([value, text]) => ({ value, label: text }));

function countryCode(country) {
  if (!country) return null;
  if (country.length === 2 && countries.isValid(country.toUpperCase())) return country.toUpperCase();
  return countries.getAlpha2Code(country, 'en') || null;
}

function countryLabel(country) {
  const code = countryCode(country);
  if (country?.length === 2 && code) return countries.getName(code, 'en');
  return country || 'Unknown';
}

// ==============================|| ROUTING NUMBERS ||============================== //

export default function GatewayClients() {
  const { hasScope } = useAuth();
  const fromRegistry = hasScope(SCOPES.GC_READ);
  const canOpenUsers = hasScope(SCOPES.CREDS_READ);
  const canManage = fromRegistry && hasScope(SCOPES.GC_WRITE);
  const [form, setForm] = useState({ open: false, client: null, etag: null });
  const [menu, setMenu] = useState({ anchor: null, client: null });
  const [confirm, setConfirm] = useState(null);
  const [notice, setNotice] = useState('');
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [operator, setOperator] = useState('');
  const [protocol, setProtocol] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    (fromRegistry ? listGatewayClientRegistry : listGatewayClients)({ signal: controller.signal })
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(err, "We couldn't load routing numbers."));
        setLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey, fromRegistry]);

  const options = useMemo(() => {
    const distinct = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
    return {
      countries: distinct(clients.map((client) => client.country)),
      operators: distinct(clients.filter((client) => !country || client.country === country).map((client) => client.operator)),
      protocols: distinct(clients.flatMap((client) => client.protocols || []))
    };
  }, [clients, country]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients.filter(
      (client) =>
        (!status || (status === 'enabled') === (client.enabled !== false)) &&
        (!country || client.country === country) &&
        (!operator || client.operator === operator) &&
        (!protocol || client.protocols?.includes(protocol)) &&
        (!term ||
          client.msisdn?.toLowerCase().includes(term) ||
          client.operator?.toLowerCase().includes(term) ||
          client.operator_code?.toLowerCase().includes(term))
    );
  }, [clients, search, status, country, operator, protocol]);

  useEffect(() => setPage(0), [search, status, country, operator, protocol]);

  const active = clients.filter((client) => client.enabled !== false);
  const disabledCount = clients.length - active.length;
  const countryCount = new Set(active.map((client) => client.country).filter(Boolean)).size;
  const operatorCount = new Set(active.map((client) => `${client.country}|${client.operator}`)).size;
  const columns = (fromRegistry ? 7 : 5) + (canManage ? 1 : 0);
  const reload = () => setReloadKey((key) => key + 1);

  // Like attempt, but a conflict also reloads the list so the other admin's change shows once the dialog closes.
  const guard = (promise, fallback) =>
    attempt(promise, fallback).catch((err) => {
      if (err.conflict) reload();
      throw err;
    });

  const handleSubmit = async (values) => {
    const fields = {
      country: values.country.trim(),
      operator: values.operator.trim(),
      operator_code: values.operator_code.trim(),
      protocols: values.protocols
    };
    if (form.client) {
      // Send only what changed; the registry leaves omitted fields as they are.
      const changes = Object.fromEntries(
        Object.entries(fields).filter(([key, value]) => value !== '' && JSON.stringify(value) !== JSON.stringify(form.client[key]))
      );
      if (Object.keys(changes).length) {
        await guard(updateGatewayClient(form.client.id, changes, form.etag), "We couldn't save the changes.");
        setNotice(`${form.client.msisdn} saved`);
      } else {
        // Nothing edited, so nothing is sent (and nothing can overwrite anyone else's change).
        setNotice(`No changes to save for ${form.client.msisdn}`);
      }
    } else {
      // Empty country, operator or code are left for the server to work out from the number.
      await attempt(createGatewayClient({ msisdn: values.msisdn, ...fields }), "We couldn't add the number.");
      setNotice(`${values.msisdn} added`);
    }
    setForm({ open: false, client: null });
    reload();
  };

  // etag: from the same read as `client`, so a change made after it was shown is refused (412).
  const actions = (client, etag) => [
    { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => setForm({ open: true, client, etag }) },
    client.enabled
      ? {
          key: 'disable',
          label: 'Disable',
          icon: <StopOutlined />,
          onClick: () =>
            setConfirm({
              title: `Disable ${client.msisdn}?`,
              message: 'It stops appearing in the public list, so apps stop sending messages through it. You can enable it again any time.',
              confirmLabel: 'Disable',
              danger: true,
              run: async () => {
                await guard(updateGatewayClient(client.id, { enabled: false }, etag), "We couldn't disable the number.");
                setNotice(`${client.msisdn} disabled`);
                reload();
              }
            })
        }
      : {
          key: 'enable',
          label: 'Enable',
          icon: <CheckCircleOutlined />,
          onClick: async () => {
            try {
              await guard(updateGatewayClient(client.id, { enabled: true }, etag), "We couldn't enable the number.");
              setNotice(`${client.msisdn} enabled`);
              reload();
            } catch (err) {
              setNotice(err.message);
            }
          }
        },
    {
      key: 'delete',
      label: 'Remove',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () =>
        setConfirm({
          title: `Remove ${client.msisdn}?`,
          message: 'It is deleted from the registry for good. To stop using it for a while, disable it instead.',
          confirmLabel: 'Remove',
          danger: true,
          run: async () => {
            await guard(deleteGatewayClient(client.id, etag), "We couldn't remove the number.");
            setNotice(`${client.msisdn} removed`);
            reload();
          }
        })
    }
  ];
  const rows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Reads the number fresh (with its ETag) before acting, so dialogs show and save against the current version.
  const runAction = async (listed, key) => {
    try {
      const { client, etag } = await getGatewayClient(listed.id);
      const action = actions(client, etag).find((item) => item.key === key);
      if (!action) {
        setNotice(`${listed.msisdn} was changed by someone else. The list is up to date now.`);
        reload();
        return;
      }
      action.onClick();
    } catch (err) {
      setNotice(
        err.response?.status === 404
          ? `${listed.msisdn} no longer exists. The list is up to date now.`
          : getErrorMessage(err, "We couldn't load this number.")
      );
      reload();
    }
  };

  return (
    <Grid container rowSpacing={3} columnSpacing={2.75}>
      <Grid size={12}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1 }}>
          <Box>
            <Typography variant="h5">Routing numbers</Typography>
            <Typography variant="body2" color="text.secondary">
              Phone numbers that receive RelaySMS messages and forward them to the Publisher
            </Typography>
          </Box>
          {canManage && (
            <MuiButton variant="contained" startIcon={<PlusOutlined />} onClick={() => setForm({ open: true, client: null })}>
              Add routing number
            </MuiButton>
          )}
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <AnalyticEcommerce
          title="Routing numbers"
          count={loading ? '—' : active.length.toLocaleString()}
          extra={fromRegistry && disabledCount > 0 ? `Active · ${disabledCount.toLocaleString()} disabled` : 'Active numbers'}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <AnalyticEcommerce
          title="Countries"
          count={loading ? '—' : countryCount.toLocaleString()}
          extra="With at least one routing number"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <AnalyticEcommerce title="Operators" count={loading ? '—' : operatorCount.toLocaleString()} extra="Mobile networks covered" />
      </Grid>

      <Grid size={12}>
        <MainCard contentSX={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Space wrap size="middle">
            <Input
              allowClear
              prefix={<SearchOutlined />}
              placeholder="Search number or operator"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{ width: 240 }}
            />
            {fromRegistry && (
              <Select
                placeholder="Status"
                value={status || undefined}
                onChange={(value) => setStatus(value || '')}
                allowClear
                style={{ width: 140 }}
                options={STATUS_OPTIONS}
              />
            )}
            <Select
              placeholder="Country"
              value={country || undefined}
              onChange={(value) => {
                setCountry(value || '');
                setOperator('');
              }}
              allowClear
              showSearch
              style={{ width: 200 }}
              options={options.countries.map((name) => ({ value: name, label: `${countryFlag(countryCode(name))} ${countryLabel(name)}` }))}
            />
            <Select
              placeholder="Operator"
              value={operator || undefined}
              onChange={(value) => setOperator(value || '')}
              allowClear
              showSearch
              style={{ width: 200 }}
              options={options.operators.map((name) => ({ value: name, label: name }))}
            />
            <Select
              placeholder="Protocol"
              value={protocol || undefined}
              onChange={(value) => setProtocol(value || '')}
              allowClear
              style={{ width: 140 }}
              options={options.protocols.map((name) => ({ value: name, label: protocolLabel(name) }))}
            />
            <Button type="text" icon={<ReloadOutlined />} onClick={() => setReloadKey((key) => key + 1)}>
              Refresh
            </Button>
          </Space>
        </MainCard>
      </Grid>

      <Grid size={12}>
        <MainCard content={false}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Loader size={40} fullScreen={false} />
            </Box>
          ) : error ? (
            <ErrorDisplay message={error} onRetry={() => setReloadKey((key) => key + 1)} />
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Number</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>Operator</TableCell>
                      <TableCell>Operator code</TableCell>
                      <TableCell>Protocols</TableCell>
                      {fromRegistry && <TableCell>Status</TableCell>}
                      {fromRegistry && <TableCell>Last changed</TableCell>}
                      {canManage && <TableCell />}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns} sx={{ border: 0 }}>
                          <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                            {clients.length === 0 ? 'No routing numbers are registered' : 'No routing numbers match these filters'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((client) => (
                        <TableRow key={client.id ?? client.msisdn} hover sx={{ opacity: client.enabled === false ? 0.6 : 1 }}>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{client.msisdn}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <span style={{ marginRight: 8 }}>{countryFlag(countryCode(client.country))}</span>
                            {countryLabel(client.country)}
                          </TableCell>
                          <TableCell>{client.operator || '—'}</TableCell>
                          <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>{client.operator_code || '—'}</TableCell>
                          <TableCell>
                            <Stack direction="row" sx={{ gap: 0.5, flexWrap: 'wrap' }}>
                              {(client.protocols || []).map((name) => (
                                <Chip key={name} size="small" variant="light" color="primary" label={protocolLabel(name)} />
                              ))}
                            </Stack>
                          </TableCell>
                          {fromRegistry && (
                            <TableCell>
                              <Chip
                                size="small"
                                label={client.enabled ? GATEWAY_CLIENT_STATUS.enabled : GATEWAY_CLIENT_STATUS.disabled}
                                sx={{ bgcolor: client.enabled ? 'success.dark' : '#64748B', color: '#fff', fontWeight: 500 }}
                              />
                            </TableCell>
                          )}
                          {fromRegistry && (
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                              <Tooltip title={dayjs(client.updated_at).format('MMM D, YYYY HH:mm')}>
                                <span>{dayjs(client.updated_at).fromNow()}</span>
                              </Tooltip>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                by{' '}
                                {client.updated_by ? (
                                  canOpenUsers ? (
                                    <Link
                                      component={RouterLink}
                                      to={`/users?user=${encodeURIComponent(client.updated_by)}`}
                                      underline="hover"
                                    >
                                      {client.updated_by}
                                    </Link>
                                  ) : (
                                    client.updated_by
                                  )
                                ) : (
                                  // The registry leaves this empty for the CLI and for users removed since.
                                  'the command line or a removed user'
                                )}
                              </Typography>
                            </TableCell>
                          )}
                          {canManage && (
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                aria-label={`Actions for ${client.msisdn}`}
                                onClick={(event) => setMenu({ anchor: event.currentTarget, client })}
                              >
                                <MoreOutlined />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(event, next) => setPage(next)}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </MainCard>
      </Grid>

      <Menu
        anchorEl={menu.anchor}
        open={Boolean(menu.anchor)}
        onClose={() => setMenu({ anchor: null, client: null })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menu.client &&
          actions(menu.client).map((action) => (
            <MenuItem
              key={action.key}
              onClick={() => {
                setMenu({ anchor: null, client: null });
                runAction(menu.client, action.key);
              }}
              sx={action.danger ? { color: 'error.main' } : undefined}
            >
              <ListItemIcon sx={action.danger ? { color: 'error.main' } : undefined}>{action.icon}</ListItemIcon>
              {action.label}
            </MenuItem>
          ))}
      </Menu>
      <GatewayClientDialog
        open={form.open}
        client={form.client}
        onClose={() => setForm({ open: false, client: null })}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog action={confirm} onClose={() => setConfirm(null)} />
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4000}
        onClose={() => setNotice('')}
        message={notice}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Grid>
  );
}
