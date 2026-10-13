import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// material-ui
import { alpha } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import ErrorDisplay from 'components/ErrorDisplay';
import { useAuth } from 'contexts/AuthContext';
import { getErrorMessage } from 'api/admin';
import {
  createCredential,
  deleteCredential,
  getCredential,
  listCredentials,
  resetCredentialPassword,
  revokeCredentialSessions,
  updateCredential
} from 'api/publisher';
import { SCOPES } from 'utils/scopes';
import { CREDENTIAL_STATUS } from 'utils/backendLabels';
import RoleChip from 'sections/credentials/RoleChip';
import { ConfirmDialog, CredentialFormDialog, PasswordDialog } from 'sections/credentials/CredentialDialogs';

// assets
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import KeyOutlined from '@ant-design/icons/KeyOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import StopOutlined from '@ant-design/icons/StopOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import HistoryOutlined from '@ant-design/icons/HistoryOutlined';

dayjs.extend(relativeTime);

async function attempt(promise, fallback) {
  try {
    return await promise;
  } catch (error) {
    // 412: the user changed after this dialog loaded them (If-Match no longer matches).
    if (error.response?.status === 412) {
      const conflict = new Error('Someone else changed this user while you had this open. Close it to see their change, then try again.');
      conflict.conflict = true;
      throw conflict;
    }
    // Other errors, including 409 (username taken, or a clash mid-save), carry a message meant for users.
    throw new Error(getErrorMessage(error, fallback));
  }
}

function When({ value, empty = 'Never' }) {
  if (!value) {
    return (
      <Typography variant="body2" color="text.secondary" component="span">
        {empty}
      </Typography>
    );
  }
  return (
    <Tooltip title={dayjs(value).format('MMM D, YYYY HH:mm')}>
      <span>{dayjs(value).fromNow()}</span>
    </Tooltip>
  );
}

When.propTypes = { value: PropTypes.string, empty: PropTypes.string };

// ==============================|| USERS ||============================== //

export default function Credentials() {
  const { credential: me, hasScope } = useAuth();
  const canWrite = hasScope(SCOPES.CREDS_WRITE);
  const myScopes = me?.scopes ?? [];

  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ open: false, credential: null, etag: null });
  const [password, setPassword] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [menu, setMenu] = useState({ anchor: null, credential: null });
  const [notice, setNotice] = useState('');

  const [refreshing, setRefreshing] = useState(false);
  // ?user=jane (e.g. from a name in Logs) scrolls to and highlights that user.
  const [searchParams, setSearchParams] = useSearchParams();
  const focusUser = searchParams.get('user');
  const canViewLogs = hasScope(SCOPES.AUDIT_READ);
  const focusMissing = Boolean(focusUser) && !loading && !error && !credentials.some((c) => c.username === focusUser);

  const load = useCallback(async () => {
    setError('');
    setRefreshing(true);
    try {
      setCredentials(await listCredentials());
    } catch (err) {
      setError(getErrorMessage(err, "We couldn't load users."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // The API refuses changes to yourself and to credentials holding scopes you lack.
  const lockReason = (credential) => {
    if (!canWrite) return 'You can view users but not change them';
    if (credential.username === me?.username) return "You can't change your own access. Ask another administrator.";
    if (credential.scopes.some((scope) => !myScopes.includes(scope)))
      return "This user has access you don't have, so only an administrator can change them";
    return null;
  };

  const closeMenu = () => setMenu({ anchor: null, credential: null });

  // Like attempt, but a conflict also reloads the list so the other admin's change shows once the dialog closes.
  const guard = (promise, fallback) =>
    attempt(promise, fallback).catch((err) => {
      if (err.conflict) load();
      throw err;
    });

  const handleSubmit = async ({ username, scopes }) => {
    if (form.credential) {
      const unchanged = scopes.length === form.credential.scopes.length && scopes.every((scope) => form.credential.scopes.includes(scope));
      if (unchanged) {
        // Nothing edited, so nothing is sent (and no empty "Changed user" entry lands in Logs).
        setNotice(`No changes to save for ${form.credential.username}`);
      } else {
        await guard(updateCredential(form.credential.username, { scopes }, form.etag), "We couldn't save their access.");
        setNotice(`Access for ${form.credential.username} saved`);
      }
    } else {
      const created = await attempt(createCredential({ username, scopes }), "We couldn't add the user.");
      setPassword({ username: created.username, password: created.password });
    }
    setForm({ open: false, credential: null });
    load();
  };

  // etag: from the same read as `credential`, so a change made after it was shown is refused (412).
  const actions = (credential, etag) => [
    {
      key: 'edit',
      label: 'Change access',
      icon: <EditOutlined />,
      onClick: () => setForm({ open: true, credential, etag })
    },
    credential.active
      ? {
          key: 'disable',
          label: 'Disable',
          icon: <StopOutlined />,
          onClick: () =>
            setConfirm({
              title: `Disable ${credential.username}?`,
              message: 'They are signed out and can’t sign in or use the API until you enable them again.',
              confirmLabel: 'Disable',
              danger: true,
              run: async () => {
                await guard(updateCredential(credential.username, { active: false }, etag), "We couldn't disable this user.");
                setNotice(`${credential.username} disabled`);
                load();
              }
            })
        }
      : {
          key: 'enable',
          label: 'Enable',
          icon: <CheckCircleOutlined />,
          onClick: async () => {
            try {
              await guard(updateCredential(credential.username, { active: true }, etag), "We couldn't enable this user.");
              setNotice(`${credential.username} enabled`);
              load();
            } catch (err) {
              setNotice(err.message);
            }
          }
        },
    {
      key: 'reset',
      label: 'Reset password',
      icon: <KeyOutlined />,
      onClick: () =>
        setConfirm({
          title: `Reset the password for ${credential.username}?`,
          message: 'Their current password stops working and they are signed out. You’ll see the new password once, to send to them.',
          confirmLabel: 'Reset password',
          run: async () => {
            const result = await guard(resetCredentialPassword(credential.username, etag), "We couldn't reset the password.");
            setPassword({ username: result.username, password: result.password });
            load();
          }
        })
    },
    {
      key: 'revoke',
      label: 'Sign out everywhere',
      icon: <LogoutOutlined />,
      disabled: credential.active_sessions === 0,
      onClick: () =>
        setConfirm({
          title: `Sign out ${credential.username} everywhere?`,
          message: `Ends ${credential.active_sessions} active session${credential.active_sessions === 1 ? '' : 's'}. Their password still works.`,
          confirmLabel: 'Sign out',
          run: async () => {
            await attempt(revokeCredentialSessions(credential.username), "We couldn't end the sessions.");
            setNotice(`${credential.username} signed out everywhere`);
            load();
          }
        })
    },
    {
      key: 'delete',
      label: 'Remove user',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () =>
        setConfirm({
          title: `Remove ${credential.username}?`,
          message: 'They lose access for good, and any scripts using their login stop working. This can’t be undone.',
          confirmLabel: 'Remove user',
          danger: true,
          run: async () => {
            await guard(deleteCredential(credential.username, etag), "We couldn't remove this user.");
            setNotice(`${credential.username} removed`);
            load();
          }
        })
    }
  ];

  // Reads the user fresh (with its ETag) before acting, so dialogs show and save against the current version.
  const runAction = async (listed, key) => {
    try {
      const { credential, etag } = await getCredential(listed.username);
      const action = actions(credential, etag).find((item) => item.key === key);
      if (!action) {
        // e.g. Disable picked, but someone already disabled them.
        setNotice(`${listed.username} was changed by someone else. The list is up to date now.`);
        load();
        return;
      }
      action.onClick();
    } catch (err) {
      setNotice(
        err.response?.status === 404
          ? `${listed.username} no longer exists. The list is up to date now.`
          : getErrorMessage(err, "We couldn't load this user.")
      );
      load();
    }
  };

  return (
    <Grid container rowSpacing={3} columnSpacing={2.75}>
      <Grid size={12}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1 }}>
          <Box>
            <Typography variant="h5">Users</Typography>
            <Typography variant="body2" color="text.secondary">
              People who can sign in to this dashboard and the Publisher API, and what each of them can do
            </Typography>
          </Box>
          <Stack direction="row" sx={{ gap: 1 }}>
            {/* Picks up changes made elsewhere, e.g. by another admin or ./creds.sh, and fresh sign-in times. */}
            <Button color="secondary" startIcon={<ReloadOutlined spin={refreshing} />} onClick={load} disabled={refreshing}>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </Button>
            {canWrite && (
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => setForm({ open: true, credential: null })}>
                Add user
              </Button>
            )}
          </Stack>
        </Stack>
      </Grid>

      {focusMissing && (
        <Grid size={12}>
          <Alert severity="warning" onClose={() => setSearchParams({}, { replace: true })}>
            There&apos;s no user called <strong>{focusUser}</strong> any more. They may have been removed or renamed.
          </Alert>
        </Grid>
      )}

      {!canWrite && (
        <Grid size={12}>
          <Alert severity="info">
            You can see who has access. To add or change users, ask an administrator for the Manage users permission.
          </Alert>
        </Grid>
      )}

      <Grid size={12}>
        <MainCard content={false}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Loader size={40} fullScreen={false} />
            </Box>
          ) : error ? (
            <ErrorDisplay message={error} onRetry={load} />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Last sign-in</TableCell>
                    <TableCell align="right">Sessions</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {credentials.map((credential) => {
                    const locked = lockReason(credential);
                    return (
                      <TableRow
                        key={credential.username}
                        hover
                        ref={(node) => {
                          if (node && credential.username === focusUser && !node.dataset.scrolled) {
                            node.dataset.scrolled = 'true';
                            node.scrollIntoView({ block: 'center', behavior: 'smooth' });
                          }
                        }}
                        sx={
                          credential.username === focusUser
                            ? (theme) => ({
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                boxShadow: `inset 3px 0 0 ${theme.palette.primary.main}`
                              })
                            : undefined
                        }
                      >
                        <TableCell sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                          {credential.username}
                          {credential.username === me?.username && (
                            <Chip size="small" label="You" variant="outlined" sx={{ ml: 1, fontFamily: 'inherit' }} />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={credential.active ? CREDENTIAL_STATUS.active : CREDENTIAL_STATUS.disabled}
                            sx={{ bgcolor: credential.active ? 'success.dark' : '#64748B', color: '#fff', fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <RoleChip credential={credential} />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <When value={credential.last_login_at} />
                        </TableCell>
                        <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                          {credential.active_sessions}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <When value={credential.created_at} />
                        </TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          {canViewLogs && (
                            <Tooltip title="View activity in Logs">
                              <IconButton
                                size="small"
                                component={RouterLink}
                                to={`/logs?actor=${encodeURIComponent(credential.username)}`}
                                aria-label={`Activity for ${credential.username}`}
                              >
                                <HistoryOutlined />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={locked || ''}>
                            <span>
                              <IconButton
                                size="small"
                                aria-label={`Actions for ${credential.username}`}
                                disabled={Boolean(locked)}
                                onClick={(event) => setMenu({ anchor: event.currentTarget, credential })}
                              >
                                <MoreOutlined />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </MainCard>
      </Grid>

      <Menu
        anchorEl={menu.anchor}
        open={Boolean(menu.anchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menu.credential &&
          actions(menu.credential).map((action) => (
            <MenuItem
              key={action.key}
              disabled={action.disabled}
              onClick={() => {
                closeMenu();
                runAction(menu.credential, action.key);
              }}
              sx={action.danger ? { color: 'error.main' } : undefined}
            >
              <ListItemIcon sx={action.danger ? { color: 'error.main' } : undefined}>{action.icon}</ListItemIcon>
              {action.label}
            </MenuItem>
          ))}
      </Menu>

      <CredentialFormDialog
        open={form.open}
        credential={form.credential}
        grantable={myScopes}
        onClose={() => setForm({ open: false, credential: null })}
        onSubmit={handleSubmit}
      />
      <ConfirmDialog action={confirm} onClose={() => setConfirm(null)} />
      <PasswordDialog result={password} onClose={() => setPassword(null)} />
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
