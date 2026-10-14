import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import { getErrorMessage } from 'api/admin';
import { installPlatformAdapter, updatePlatformAdapter } from 'api/publisher';
import AdapterJobProgress from './AdapterJobProgress';

const GITHUB_REPO = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;

// ==============================|| INSTALL / UPDATE ADAPTER ||============================== //

export default function AdapterVersionDialog({ open, adapter, onClose, onFinished }) {
  const updating = Boolean(adapter);
  const [sourceUrl, setSourceUrl] = useState('');
  const [tag, setTag] = useState('');
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [jobDone, setJobDone] = useState(false);
  const [trouble, setTrouble] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSourceUrl('');
    setTag('');
    setJob(null);
    setJobDone(false);
    setTrouble(false);
    setError('');
    setSubmitting(false);
  }, [open, adapter]);

  const urlValid = updating || GITHUB_REPO.test(sourceUrl.trim());
  // Locked while the job runs, unless checking on it keeps failing, so nobody is stuck.
  const running = Boolean(job) && !jobDone && !trouble;

  const start = async (event) => {
    event.preventDefault();
    if (!urlValid || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const started = updating
        ? await updatePlatformAdapter(adapter.id, tag.trim() || null)
        : await installPlatformAdapter({ source_url: sourceUrl.trim().replace(/\/$/, ''), tag: tag.trim() || null });
      setJob(started);
    } catch (err) {
      setError(getErrorMessage(err, updating ? "We couldn't start the update." : "We couldn't start the install."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting || running ? undefined : onClose}
      disableEscapeKeyDown={running}
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <form onSubmit={start} style={{ display: 'contents' }}>
        <DialogTitle>
          {updating ? `Update ${adapter.display_name || adapter.name}` : 'Install a platform'}
          <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {updating
              ? `Now on ${adapter.tag || 'an untagged version'} (${String(adapter.commit || '').slice(0, 7)}).`
              : 'Adds a platform adapter from its GitHub repository.'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {job ? (
            <AdapterJobProgress
              job={job}
              name={updating ? adapter.display_name || adapter.name : sourceUrl.trim().replace(/\/$/, '').split('/').pop()}
              onTrouble={setTrouble}
              onDone={(finished) => {
                setJobDone(true);
                onFinished?.(finished);
              }}
            />
          ) : (
            <Stack sx={{ gap: 2.5 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {!updating && (
                <TextField
                  label="Repository"
                  placeholder="https://github.com/smswithoutborders/gmail-oauth2-adapter"
                  value={sourceUrl}
                  onChange={(event) => setSourceUrl(event.target.value)}
                  error={sourceUrl !== '' && !urlValid}
                  helperText="A GitHub repository from an organisation this Publisher trusts"
                  autoFocus
                  fullWidth
                  slotProps={{ htmlInput: { autoComplete: 'off', spellCheck: false } }}
                />
              )}
              <TextField
                label="Version"
                placeholder="e.g. v1.2.0"
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                helperText="A version tag from the repository. Leave empty for the newest."
                autoFocus={updating}
                fullWidth
                slotProps={{ htmlInput: { autoComplete: 'off', spellCheck: false, maxLength: 100 } }}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {job ? (
            running ? (
              <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                You can close this once it finishes.
              </Typography>
            ) : (
              <Button variant="contained" onClick={onClose}>
                Close
              </Button>
            )
          ) : (
            <>
              <Button color="secondary" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={!urlValid || submitting}>
                {submitting ? 'Starting…' : updating ? 'Update' : 'Install'}
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}

AdapterVersionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  adapter: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onFinished: PropTypes.func
};
