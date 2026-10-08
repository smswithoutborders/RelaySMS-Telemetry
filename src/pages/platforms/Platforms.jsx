import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// antd
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

// project imports
import MainCard from 'components/MainCard';
import Loader from 'components/Loader';
import ErrorDisplay from 'components/ErrorDisplay';
import { useAuth } from 'contexts/AuthContext';
import { getErrorMessage } from 'api/admin';
import { getPublicationSummary, listPlatforms } from 'api/publisher';
import PlatformLogo from 'components/PlatformLogo';
import { PLATFORM_AUTH, PLATFORM_CATEGORIES } from 'utils/backendLabels';
import { SCOPES } from 'utils/scopes';
import { foldByStatus } from 'sections/publications/usePublicationStats';

function iconSource(platform) {
  const svg = platform.icon_svg?.trim();
  if (svg?.startsWith('<')) return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  if (svg) return svg;
  if (platform.icon_png) return platform.icon_png;
  return null;
}

function PlatformCard({ platform, usage }) {
  const src = iconSource(platform);
  const rate = usage?.total ? (usage.published / usage.total) * 100 : null;

  return (
    <MainCard sx={{ height: '100%' }}>
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
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            {platform.display_name || platform.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            {platform.name}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', mb: usage === undefined ? 0 : 2 }}>
        <Chip size="small" variant="light" color="primary" label={PLATFORM_CATEGORIES[platform.cat_id] ?? `Category ${platform.cat_id}`} />
        <Chip
          size="small"
          variant="light"
          color="secondary"
          label={`${PLATFORM_AUTH[platform.proto_id] ?? `Protocol ${platform.proto_id}`}${platform.auth_provider ? ` · ${platform.auth_provider}` : ''}`}
        />
        {platform.supports_offline_first && <Chip size="small" variant="light" color="success" label="Offline-first" />}
      </Stack>

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
  // undefined hides usage (no stats scope); null means no publications.
  usage: PropTypes.object
};

// ==============================|| PLATFORMS ||============================== //

export default function Platforms() {
  const { hasScope } = useAuth();
  const withStats = hasScope(SCOPES.STATS_READ);
  const [platforms, setPlatforms] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const config = { signal: controller.signal };
    setLoading(true);
    setError('');
    listPlatforms(config)
      .then((data) => {
        setPlatforms([...data].sort((a, b) => (a.display_name || a.name).localeCompare(b.display_name || b.name)));
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(err, "We couldn't load platforms."));
        setLoading(false);
      });
    // Usage is extra; the page still works without it.
    if (withStats) {
      getPublicationSummary(
        { groupBy: ['platform_name', 'status'], filters: { since: dayjs().subtract(30, 'day'), until: dayjs() } },
        config
      )
        .then(({ groups }) => setUsage(new Map(foldByStatus(groups, 'platform_name').map((row) => [row.key, row]))))
        .catch(() => setUsage(null));
    }
    return () => controller.abort();
  }, [reloadKey, withStats]);

  const usageFor = (name) => {
    if (!withStats || !usage) return undefined;
    return usage.get(name) ?? null;
  };

  return (
    <Grid container rowSpacing={3} columnSpacing={2.75}>
      <Grid size={12}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Box>
            <Typography variant="h5">Platforms</Typography>
            <Typography variant="body2" color="text.secondary">
              Services the Publisher can post to on a user&apos;s behalf
            </Typography>
          </Box>
          <Button type="text" icon={<ReloadOutlined />} onClick={() => setReloadKey((key) => key + 1)}>
            Refresh
          </Button>
        </Stack>
      </Grid>

      {loading ? (
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Loader size={40} fullScreen={false} />
          </Box>
        </Grid>
      ) : error ? (
        <Grid size={12}>
          <MainCard>
            <ErrorDisplay message={error} onRetry={() => setReloadKey((key) => key + 1)} />
          </MainCard>
        </Grid>
      ) : platforms.length === 0 ? (
        <Grid size={12}>
          <MainCard>
            <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
              No platform adapters are installed on this Publisher
            </Typography>
          </MainCard>
        </Grid>
      ) : (
        platforms.map((platform) => (
          <Grid key={platform.name} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
            <PlatformCard platform={platform} usage={usageFor(platform.name)} />
          </Grid>
        ))
      )}
    </Grid>
  );
}
