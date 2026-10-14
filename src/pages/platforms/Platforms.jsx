import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiButton from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// antd
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

// project imports
import MainCard from 'components/MainCard';
import LoadingOverlay from 'components/LoadingOverlay';
import ErrorDisplay from 'components/ErrorDisplay';
import PlatformLogo from 'components/PlatformLogo';
import { useAuth } from 'contexts/AuthContext';
import { getErrorMessage } from 'api/admin';
import {
  getPlatformAdapter,
  getPublicationSummary,
  listPlatformAdapters,
  listPlatforms,
  setPlatformAdapterEnabled,
  uninstallPlatformAdapter
} from 'api/publisher';
import { ADAPTER_STATUS, PLATFORM_AUTH, PLATFORM_CATEGORIES } from 'utils/backendLabels';
import { SCOPES } from 'utils/scopes';
import { foldByStatus } from 'sections/publications/usePublicationStats';
import { ConfirmDialog } from 'sections/credentials/CredentialDialogs';
import AdapterVersionDialog from 'sections/platforms/AdapterVersionDialog';
import AdapterSettingsDialog from 'sections/platforms/AdapterSettingsDialog';
import AdapterJobsDialog from 'sections/platforms/AdapterJobsDialog';

// assets
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
import HistoryOutlined from '@ant-design/icons/HistoryOutlined';
import StopOutlined from '@ant-design/icons/StopOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import GithubOutlined from '@ant-design/icons/GithubOutlined';

dayjs.extend(relativeTime);

function iconSource(platform) {
  const svg = platform.icon_svg?.trim();
  if (svg?.startsWith('<')) return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  if (svg) return svg;
  if (platform.icon_png) return platform.icon_png;
  return null;
}

// Turns an API error into an Error whose message is fit to show; 412 means it changed after it was loaded.
async function attempt(promise, fallback) {
  try {
    return await promise;
  } catch (error) {
    if (error.response?.status === 412) {
      const conflict = new Error(
        'Someone else changed this platform while you had this open. Close it to see their change, then try again.'
      );
      conflict.conflict = true;
      throw conflict;
    }
    throw new Error(getErrorMessage(error, fallback));
  }
}

const solid = (bgcolor) => ({ bgcolor, color: '#fff', fontWeight: 500 });

// adapter fields (enabled, configured, tag, …) are only there when listed from /platforms/adapters.
function PlatformCard({ platform, usage, onMenu, canOpenUsers }) {
  const src = iconSource(platform);
  const rate = usage?.total ? (usage.published / usage.total) * 100 : null;
  const isAdapter = platform.enabled !== undefined;
  const repo = platform.source_url?.replace(/^https:\/\/github\.com\//, '');

  return (
    <MainCard sx={{ height: '100%', opacity: isAdapter && !platform.enabled ? 0.75 : 1 }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {/* The adapter's own icon if it ships one, otherwise ours from utils/backendLabels. */}
          {src ? (
            <img src={src} alt="" width={26} height={26} style={{ objectFit: 'contain' }} />
          ) : (
            <PlatformLogo name={platform.name} size={26} />
          )}
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h6" noWrap>
            {platform.display_name || platform.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            {platform.name}
          </Typography>
        </Box>
        {onMenu && (
          <IconButton size="small" aria-label={`Actions for ${platform.display_name || platform.name}`} onClick={onMenu}>
            <MoreOutlined />
          </IconButton>
        )}
      </Stack>

      {isAdapter && (
        <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', mb: 1.25 }}>
          <Chip
            size="small"
            label={platform.enabled ? ADAPTER_STATUS.enabled : ADAPTER_STATUS.disabled}
            sx={solid(platform.enabled ? 'success.dark' : '#64748B')}
          />
          {!platform.configured && (
            <Tooltip title="A required setting has no value yet, so it can't publish. An administrator can fill it in under Settings.">
              <Chip size="small" label={ADAPTER_STATUS.unconfigured} sx={{ ...solid('#c2760c'), cursor: 'help' }} />
            </Tooltip>
          )}
        </Stack>
      )}

      <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', mb: isAdapter || usage !== undefined ? 2 : 0 }}>
        <Chip size="small" variant="light" color="primary" label={PLATFORM_CATEGORIES[platform.cat_id] ?? `Category ${platform.cat_id}`} />
        <Chip
          size="small"
          variant="light"
          color="secondary"
          label={`${PLATFORM_AUTH[platform.proto_id] ?? `Protocol ${platform.proto_id}`}${platform.auth_provider ? ` · ${platform.auth_provider}` : ''}`}
        />
        {platform.supports_offline_first && <Chip size="small" variant="light" color="success" label="Offline-first" />}
      </Stack>

      {isAdapter && (
        <Stack sx={{ gap: 0.5, mb: usage !== undefined ? 2 : 0 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2">
              {platform.tag || 'Untagged'}{' '}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {String(platform.commit || '').slice(0, 7)}
              </Typography>
            </Typography>
            {repo && (
              <Link
                href={platform.source_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="caption"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
              >
                <GithubOutlined /> {repo}
              </Link>
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Changed {dayjs(platform.updated_at).fromNow()} by{' '}
            {platform.updated_by ? (
              canOpenUsers ? (
                <Link component={RouterLink} to={`/users?user=${encodeURIComponent(platform.updated_by)}`} underline="hover">
                  {platform.updated_by}
                </Link>
              ) : (
                platform.updated_by
              )
            ) : (
              'the command line or a removed user'
            )}
          </Typography>
        </Stack>
      )}

      {usage !== undefined && (
        <Stack direction="row" sx={{ justifyContent: 'space-between', pt: 1.5, borderTop: 1, borderColor: 'divider' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Publications, last 30 days
            </Typography>
            <Typography variant="subtitle1">{(usage?.total ?? 0).toLocaleString()}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Success rate
            </Typography>
            <Typography variant="subtitle1">{rate === null ? '—' : `${rate.toFixed(1)}%`}</Typography>
          </Box>
        </Stack>
      )}
    </MainCard>
  );
}

PlatformCard.propTypes = {
  platform: PropTypes.object.isRequired,
  usage: PropTypes.object,
  onMenu: PropTypes.func,
  canOpenUsers: PropTypes.bool
};

// ==============================|| PLATFORMS ||============================== //

export default function Platforms() {
  const { credential, hasScope } = useAuth();
  const withStats = hasScope(SCOPES.STATS_READ);
  const canOpenUsers = hasScope(SCOPES.CREDS_READ);
  const fromAdapters = hasScope(SCOPES.PLATFORMS_READ);
  const canManage = fromAdapters && hasScope(SCOPES.PLATFORMS_WRITE);
  const isAdmin = Boolean(credential?.administrator);

  const [platforms, setPlatforms] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [menu, setMenu] = useState({ anchor: null, platform: null });
  const [confirm, setConfirm] = useState(null);
  const [notice, setNotice] = useState('');
  const [versionDialog, setVersionDialog] = useState({ open: false, adapter: null });
  const [settingsFor, setSettingsFor] = useState(null);
  const [jobsFor, setJobsFor] = useState(null);

  const reload = () => setReloadKey((key) => key + 1);

  useEffect(() => {
    const controller = new AbortController();
    const config = { signal: controller.signal };
    setLoading(true);
    setError('');
    (fromAdapters ? listPlatformAdapters : listPlatforms)(config)
      .then((data) => {
        setPlatforms([...data].sort((a, b) => (a.display_name || a.name).localeCompare(b.display_name || b.name)));
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(err, "We couldn't load platforms."));
        setLoading(false);
      });
    if (withStats) {
      getPublicationSummary(
        { groupBy: ['platform_name', 'status'], filters: { since: dayjs().subtract(30, 'day'), until: dayjs() } },
        config
      )
        .then(({ groups }) => setUsage(new Map(foldByStatus(groups, 'platform_name').map((row) => [row.key, row]))))
        .catch(() => setUsage(null));
    }
    return () => controller.abort();
  }, [reloadKey, withStats, fromAdapters]);

  const usageFor = (name) => {
    if (!withStats || !usage) return undefined;
    return usage.get(name) ?? null;
  };

  const guard = (promise, fallback) =>
    attempt(promise, fallback).catch((err) => {
      if (err.conflict) reload();
      throw err;
    });

  const actions = (adapter, etag) => [
    ...(isAdmin
      ? [
          { key: 'settings', label: 'Settings', icon: <SettingOutlined />, onClick: () => setSettingsFor(adapter) },
          {
            key: 'update',
            label: 'Update version',
            icon: <CloudUploadOutlined />,
            onClick: () => setVersionDialog({ open: true, adapter })
          }
        ]
      : []),
    { key: 'history', label: 'Install history', icon: <HistoryOutlined />, onClick: () => setJobsFor(adapter) },
    adapter.enabled
      ? {
          key: 'disable',
          label: 'Disable',
          icon: <StopOutlined />,
          onClick: () =>
            setConfirm({
              title: `Disable ${adapter.display_name || adapter.name}?`,
              message:
                'It is hidden from users, so no one can link it or publish through it. It still revokes tokens for accounts already linked. You can enable it again any time.',
              confirmLabel: 'Disable',
              danger: true,
              run: async () => {
                await guard(setPlatformAdapterEnabled(adapter.id, false, etag), "We couldn't disable the platform.");
                setNotice(`${adapter.display_name || adapter.name} disabled`);
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
              await guard(setPlatformAdapterEnabled(adapter.id, true, etag), "We couldn't enable the platform.");
              setNotice(`${adapter.display_name || adapter.name} enabled`);
              reload();
            } catch (err) {
              setNotice(err.message);
            }
          }
        },
    {
      key: 'uninstall',
      label: 'Uninstall',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () =>
        setConfirm({
          title: `Uninstall ${adapter.display_name || adapter.name}?`,
          message:
            'This removes the platform from the Publisher. It isn’t allowed while accounts are still linked through it; disable it instead in that case.',
          confirmLabel: 'Uninstall',
          danger: true,
          run: async () => {
            await guard(uninstallPlatformAdapter(adapter.id, etag), "We couldn't uninstall the platform.");
            setNotice(`${adapter.display_name || adapter.name} uninstalled`);
            reload();
          }
        })
    }
  ];

  const runAction = async (listed, key) => {
    try {
      const { adapter, etag } = await getPlatformAdapter(listed.id);
      const action = actions(adapter, etag).find((item) => item.key === key);
      if (!action) {
        setNotice(`${listed.display_name || listed.name} was changed by someone else. The list is up to date now.`);
        reload();
        return;
      }
      action.onClick();
    } catch (err) {
      setNotice(
        err.response?.status === 404
          ? `${listed.display_name || listed.name} is no longer installed. The list is up to date now.`
          : getErrorMessage(err, "We couldn't load this platform.")
      );
      reload();
    }
  };

  const needsSetup = platforms.filter((platform) => platform.configured === false).length;

  return (
    <Grid container rowSpacing={3} columnSpacing={2.75}>
      <Grid size={12}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 1 }}>
          <Box>
            <Typography variant="h5">Platforms</Typography>
            <Typography variant="body2" color="text.secondary">
              Services the Publisher can post to on a user&apos;s behalf
            </Typography>
          </Box>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <Button type="text" icon={<ReloadOutlined />} onClick={reload}>
              Refresh
            </Button>
            {canManage && isAdmin && (
              <MuiButton variant="contained" startIcon={<PlusOutlined />} onClick={() => setVersionDialog({ open: true, adapter: null })}>
                Install platform
              </MuiButton>
            )}
          </Stack>
        </Stack>
      </Grid>

      {!loading && !error && needsSetup > 0 && (
        <Grid size={12}>
          <Alert severity="warning">
            {needsSetup} platform{needsSetup === 1 ? ' needs' : 's need'} setting up before {needsSetup === 1 ? 'it' : 'they'} can publish.
            {isAdmin ? ' Open its menu and choose Settings.' : ' Ask an administrator to fill in the settings.'}
          </Alert>
        </Grid>
      )}

      {error && !loading ? (
        <Grid size={12}>
          <MainCard>
            <ErrorDisplay message={error} onRetry={reload} />
          </MainCard>
        </Grid>
      ) : (
        <Grid size={12}>
          <LoadingOverlay loading={loading} minHeight={240} sx={{ borderRadius: 1 }}>
            {!loading && platforms.length === 0 ? (
              <MainCard>
                <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                  No platform adapters are installed on this Publisher
                </Typography>
              </MainCard>
            ) : (
              <Grid container spacing={2.75}>
                {platforms.map((platform) => (
                  <Grid key={platform.id ?? platform.name} size={{ xs: 12, sm: 6, lg: 4, xl: 4 }}>
                    <PlatformCard
                      platform={platform}
                      usage={usageFor(platform.name)}
                      canOpenUsers={canOpenUsers}
                      onMenu={canManage ? (event) => setMenu({ anchor: event.currentTarget, platform }) : undefined}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </LoadingOverlay>
        </Grid>
      )}

      <Menu
        anchorEl={menu.anchor}
        open={Boolean(menu.anchor)}
        onClose={() => setMenu({ anchor: null, platform: null })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {menu.platform &&
          actions(menu.platform).map((action) => (
            <MenuItem
              key={action.key}
              onClick={() => {
                setMenu({ anchor: null, platform: null });
                runAction(menu.platform, action.key);
              }}
              sx={action.danger ? { color: 'error.main' } : undefined}
            >
              <ListItemIcon sx={action.danger ? { color: 'error.main' } : undefined}>{action.icon}</ListItemIcon>
              {action.label}
            </MenuItem>
          ))}
      </Menu>

      <AdapterVersionDialog
        open={versionDialog.open}
        adapter={versionDialog.adapter}
        onClose={() => {
          setVersionDialog({ open: false, adapter: null });
          reload();
        }}
        onFinished={(job) => {
          if (job.state === 'succeeded') reload();
        }}
      />
      <AdapterSettingsDialog open={Boolean(settingsFor)} adapter={settingsFor} onClose={() => setSettingsFor(null)} onSaved={reload} />
      <AdapterJobsDialog open={Boolean(jobsFor)} adapter={jobsFor} onClose={() => setJobsFor(null)} />
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
