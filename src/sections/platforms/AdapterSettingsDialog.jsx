import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// project imports
import Loader from 'components/Loader';
import { getErrorMessage } from 'api/admin';
import { getAdapterConfig, runAdapterSetup, updateAdapterConfig } from 'api/publisher';
import AdapterField, { fieldError, fieldText, parseFieldValue } from './AdapterField';

const textsFor = (fields, withValues) =>
  Object.fromEntries(
    fields.map((field) => [field.name, withValues && !field.secret ? fieldText(field, field.value) : fieldText(field, null)])
  );

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

function describe(err, fallback) {
  if (err.response?.status === 412) return { conflict: true, message: 'Someone else changed these settings while you had this open.' };
  return { conflict: false, message: getErrorMessage(err, fallback) };
}

// ==============================|| ADAPTER SETTINGS ||============================== //

export default function AdapterSettingsDialog({ open, adapter, onClose, onSaved }) {
  const [state, setState] = useState({ loading: true, error: '', config: null, etag: null });
  const [tab, setTab] = useState('settings');
  const [texts, setTexts] = useState({});
  const [inputs, setInputs] = useState({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const load = useCallback(async () => {
    if (!adapter) return;
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    setResult(null);
    try {
      const { config, etag } = await getAdapterConfig(adapter.id);
      setState({ loading: false, error: '', config, etag });
      setTexts(textsFor(config.settings, true));
      setInputs(textsFor(config.setup, false));
    } catch (err) {
      setState({ loading: false, error: getErrorMessage(err, "We couldn't load this platform's settings."), config: null, etag: null });
    }
  }, [adapter]);

  useEffect(() => {
    if (open) {
      setTab('settings');
      load();
    }
  }, [open, load]);

  const settings = state.config?.settings ?? [];
  const setup = state.config?.setup ?? [];

  const changes = {};
  const problems = [];
  settings.forEach((field) => {
    const raw = texts[field.name];
    if (fieldError(field, raw)) problems.push(field.name);
    const next = parseFieldValue(field, raw);
    if (field.secret) {
      if (next !== undefined) changes[field.name] = next;
      return;
    }
    if (next === undefined) {
      if (field.is_set) {
        if (field.required) problems.push(field.name);
        else changes[field.name] = null;
      }
      return;
    }
    if (!same(next, field.value)) changes[field.name] = next;
  });
  const changeCount = Object.keys(changes).length;

  const setupReady =
    setup.length > 0 &&
    setup.every((field) => field.type === 'boolean' || parseFieldValue(field, inputs[field.name]) !== undefined) &&
    !setup.some((field) => fieldError(field, inputs[field.name]));

  const save = async () => {
    setBusy(true);
    setResult(null);
    try {
      const { config, etag } = await updateAdapterConfig(adapter.id, changes, state.etag);
      setState({ loading: false, error: '', config, etag });
      setTexts(textsFor(config.settings, true));
      setResult({ ok: true, message: `Saved ${changeCount} setting${changeCount === 1 ? '' : 's'}.` });
      onSaved?.();
    } catch (err) {
      setResult({ ok: false, ...describe(err, "We couldn't save the settings.") });
    } finally {
      setBusy(false);
    }
  };

  const runSetup = async () => {
    setBusy(true);
    setResult(null);
    const values = Object.fromEntries(setup.map((field) => [field.name, parseFieldValue(field, inputs[field.name])]));
    try {
      const { config, etag } = await runAdapterSetup(adapter.id, values, state.etag);
      setState({ loading: false, error: '', config, etag });
      setTexts(textsFor(config.settings, true));
      setInputs(textsFor(config.setup, false));
      setTab('settings');
      setResult({ ok: true, message: 'Setup finished and saved the settings it produced.' });
      onSaved?.();
    } catch (err) {
      setResult({ ok: false, ...describe(err, 'The setup didn’t finish.') });
    } finally {
      setBusy(false);
    }
  };

  const name = adapter?.display_name || adapter?.name;

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ pb: setup.length ? 0 : undefined }}>
        {name} settings
        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          What this platform needs to work, such as API keys. Only administrators can see or change these.
        </Typography>
        {setup.length > 0 && (
          <Tabs value={tab} onChange={(event, next) => setTab(next)} sx={{ mt: 1 }}>
            <Tab value="settings" label="Settings" />
            <Tab value="setup" label="Run setup" />
          </Tabs>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {state.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <Loader size={36} fullScreen={false} />
          </Box>
        ) : state.error ? (
          <Alert severity="error">{state.error}</Alert>
        ) : (
          <Stack sx={{ gap: 2 }}>
            {result && (
              <Alert
                severity={result.ok ? 'success' : 'error'}
                action={
                  result.conflict && (
                    <Button color="inherit" size="small" onClick={load}>
                      Load the latest
                    </Button>
                  )
                }
              >
                {result.message}
              </Alert>
            )}

            {tab === 'settings' &&
              (settings.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                  This platform has no settings.
                </Typography>
              ) : (
                settings.map((field) => (
                  <AdapterField
                    key={field.name}
                    field={field}
                    value={texts[field.name]}
                    disabled={busy}
                    onChange={(next) => setTexts((prev) => ({ ...prev, [field.name]: next }))}
                  />
                ))
              ))}

            {tab === 'setup' && (
              <>
                <Alert severity="info">
                  Setup runs the platform&apos;s own steps with these details and <strong>replaces all its current settings</strong> with
                  the result.
                </Alert>
                {setup.map((field) => (
                  <AdapterField
                    key={field.name}
                    field={{ ...field, required: true }}
                    value={inputs[field.name]}
                    disabled={busy}
                    onChange={(next) => setInputs((prev) => ({ ...prev, [field.name]: next }))}
                  />
                ))}
              </>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
        <Typography variant="caption" color="text.secondary">
          {tab === 'settings' && !state.loading && !state.error
            ? problems.length
              ? 'Fill in the required settings'
              : changeCount
                ? `${changeCount} change${changeCount === 1 ? '' : 's'} to save`
                : 'No changes'
            : ''}
        </Typography>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button color="secondary" onClick={onClose} disabled={busy}>
            Close
          </Button>
          {tab === 'settings' ? (
            <Button variant="contained" onClick={save} disabled={busy || !changeCount || problems.length > 0 || !state.config}>
              {busy ? 'Saving…' : 'Save'}
            </Button>
          ) : (
            <Button variant="contained" onClick={runSetup} disabled={busy || !setupReady}>
              {busy ? 'Running setup…' : 'Run setup'}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

AdapterSettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  adapter: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func
};
