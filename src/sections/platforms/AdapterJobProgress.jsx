import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

// material-ui
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import { getErrorMessage } from 'api/admin';
import { getAdapterJob } from 'api/publisher';
import { ADAPTER_JOB_ACTIONS, ADAPTER_JOB_STATES } from 'utils/backendLabels';

// assets
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';

const POLL_MS = 2000;
// Failed checks in a row before closing is allowed again.
const TROUBLE_AFTER = 3;
const shortCommit = (commit) => (commit ? String(commit).slice(0, 7) : null);

export function JobStateChip({ state }) {
  const info = ADAPTER_JOB_STATES[state] || { label: state, color: 'secondary.main' };
  return <Chip size="small" label={info.label} sx={{ bgcolor: info.color, color: '#fff', fontWeight: 500 }} />;
}

JobStateChip.propTypes = { state: PropTypes.string };

// The git and pip output the Publisher keeps for a job, scrolled to the end.
export function JobLog({ log, maxHeight = 280 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [log]);
  if (!log) return null;
  return (
    <Box
      ref={ref}
      component="pre"
      sx={{
        m: 0,
        p: 1.5,
        maxHeight,
        overflow: 'auto',
        borderRadius: 1,
        bgcolor: 'action.hover',
        fontFamily: 'monospace',
        fontSize: '0.8125rem'
      }}
    >
      {log}
    </Box>
  );
}

JobLog.propTypes = { log: PropTypes.string, maxHeight: PropTypes.number };

export function jobVersionText(job) {
  const from = shortCommit(job.from_commit);
  const to = shortCommit(job.to_commit);
  const version = [job.tag, to && `(${to})`].filter(Boolean).join(' ');
  if (from && to && from !== to) return `${from} → ${version}`;
  return version || 'Newest version';
}

// ==============================|| ADAPTER JOB PROGRESS ||============================== //

const STAGE = {
  queued: 'Waiting for its turn…',
  running: 'Downloading and installing…'
};

const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const breathe = keyframes`0%, 100% { opacity: 0.55; } 50% { opacity: 1; }`;

function elapsedText(ms) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function AdapterJobProgress({ job: initial, name, onDone, onTrouble }) {
  const theme = useTheme();
  const [job, setJob] = useState(initial);
  const [error, setError] = useState('');
  const failures = useRef(0);
  const [now, setNow] = useState(() => Date.now());
  const finished = ADAPTER_JOB_STATES[job.state]?.done;
  const reported = useRef(false);
  const started = useRef(Math.min(Date.parse(initial.created_at) || Date.now(), Date.now()));

  useEffect(() => {
    if (finished) return undefined;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [finished]);

  useEffect(() => {
    if (finished) {
      if (!reported.current) {
        reported.current = true;
        onDone?.(job);
      }
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      getAdapterJob(job.id, { signal: controller.signal })
        .then((next) => {
          if (failures.current >= TROUBLE_AFTER) onTrouble?.(false);
          failures.current = 0;
          setError('');
          setJob(next);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          failures.current += 1;
          if (failures.current === TROUBLE_AFTER) onTrouble?.(true);
          setError(
            failures.current >= TROUBLE_AFTER
              ? `${getErrorMessage(err, "Couldn't check on the job.")} Still trying. You can close this now; the job keeps running on the server and shows in Install history.`
              : getErrorMessage(err, "Couldn't check on the job; still trying.")
          );
          setJob((prev) => ({ ...prev }));
        });
    }, POLL_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  const action = ADAPTER_JOB_ACTIONS[job.action] || job.action;
  const tone = job.state === 'succeeded' ? 'success' : job.state === 'failed' ? 'error' : 'primary';
  const color = theme.palette[tone].main;
  const Icon = job.state === 'succeeded' ? CheckCircleFilled : job.state === 'failed' ? CloseCircleFilled : SyncOutlined;

  return (
    <Stack sx={{ gap: 2 }}>
      <Box
        role="status"
        aria-live="polite"
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: 1,
          borderColor: alpha(color, 0.4),
          bgcolor: alpha(color, theme.palette.mode === 'dark' ? 0.14 : 0.06),
          overflow: 'hidden'
        }}
      >
        <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              bgcolor: alpha(color, 0.15),
              fontSize: 24,
              '& .anticon': finished ? undefined : { animation: `${spin} 1.4s linear infinite` },
              '@media (prefers-reduced-motion: reduce)': { '& .anticon': { animation: 'none' } }
            }}
          >
            <Icon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1">
              {finished
                ? job.state === 'succeeded'
                  ? `${action} finished`
                  : `${action} failed`
                : `${action === 'Install' ? 'Installing' : 'Updating'} ${name || job.adapter_id}`}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={
                finished
                  ? undefined
                  : { animation: `${breathe} 2.4s ease-in-out infinite`, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }
              }
            >
              {finished
                ? job.state === 'succeeded'
                  ? `Now on ${jobVersionText(job)}.`
                  : "It didn't finish. The log below says why."
                : STAGE[job.state] || 'Working…'}
            </Typography>
          </Box>
          {!finished && (
            <Typography variant="h5" color="text.secondary" sx={{ fontVariantNumeric: 'tabular-nums' }} title="Time so far">
              {elapsedText(now - started.current)}
            </Typography>
          )}
        </Stack>
        {!finished && (
          <>
            <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              This usually takes a minute or two. Please keep this window open until it finishes.
            </Typography>
          </>
        )}
      </Box>

      {error && <Alert severity="warning">{error}</Alert>}
      {job.log && (
        <Box>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.75 }}>
            <Typography variant="subtitle2">Log</Typography>
            <JobStateChip state={job.state} />
          </Stack>
          <JobLog log={job.log} />
        </Box>
      )}
    </Stack>
  );
}

AdapterJobProgress.propTypes = {
  job: PropTypes.object.isRequired,
  name: PropTypes.string,
  onDone: PropTypes.func,
  onTrouble: PropTypes.func
};
