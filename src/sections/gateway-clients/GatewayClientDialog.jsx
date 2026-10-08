import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

// material-ui
import { alpha, keyframes } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import { getErrorMessage } from 'api/admin';
import { suggestGatewayClient } from 'api/publisher';
import { SUGGEST_MATCH } from 'utils/backendLabels';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';

const glow = (color) => keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${alpha(color, 0.55)}; }
  50% { box-shadow: 0 0 0 6px ${alpha(color, 0)}, 0 0 14px 2px ${alpha(color, 0.45)}; }
`;

// Offered in the protocols box; any other value can still be typed.
const KNOWN_PROTOCOLS = ['sms', 'https', 'smtp'];
const E164 = /^\+[1-9]\d{6,14}$/;
const OPERATOR_CODE = /^\d{5,6}$/;

const EMPTY = { msisdn: '', country: '', operator: '', operator_code: '', protocols: ['sms'] };

// ==============================|| ADD / EDIT ROUTING NUMBER ||============================== //

// client: null to add, or the registry entry being edited. onSubmit gets the form values and throws an Error to show.
export default function GatewayClientDialog({ open, client, onClose, onSubmit }) {
  const editing = Boolean(client);
  const [form, setForm] = useState(EMPTY);
  const [suggestion, setSuggestion] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);
  const lookupInFlight = useRef(false);
  const [lookupError, setLookupError] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(client ? { ...EMPTY, ...client, operator_code: client.operator_code ?? '' } : EMPTY);
    setSuggestion(null);
    setLookupError('');
    setError('');
    setSubmitting(false);
  }, [open, client]);

  const set = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  const msisdn = form.msisdn.replace(/[\s()-]/g, '');
  const msisdnValid = E164.test(msisdn);
  const codeValid = !form.operator_code || OPERATOR_CODE.test(form.operator_code);
  const canSubmit = (editing || msisdnValid) && codeValid && form.protocols.length > 0 && !submitting;

  const lookUp = async () => {
    if (!msisdnValid || lookupInFlight.current) return;
    lookupInFlight.current = true;
    setLookingUp(true);
    setLookupError('');
    try {
      const result = await suggestGatewayClient(msisdn);
      setSuggestion(result);
      setForm((prev) => ({
        ...prev,
        country: result.country ?? prev.country,
        operator: result.operator ?? result.candidates?.[0]?.network ?? prev.operator,
        operator_code: result.operator_code ?? result.candidates?.[0]?.operator_code ?? prev.operator_code
      }));
    } catch (err) {
      setLookupError(getErrorMessage(err, "We couldn't look up this number."));
    } finally {
      lookupInFlight.current = false;
      setLookingUp(false);
    }
  };

  const pickCandidate = (code) => {
    const candidate = suggestion?.candidates?.find((item) => item.operator_code === code);
    if (candidate) setForm((prev) => ({ ...prev, operator_code: candidate.operator_code, operator: candidate.network }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ ...form, msisdn });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const candidates = suggestion?.candidates ?? [];

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="sm" fullWidth scroll="paper">
      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        <DialogTitle>
          {editing ? `Edit ${client.msisdn}` : 'Add a routing number'}
          {!editing && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              A phone number that receives RelaySMS messages and forwards them to the Publisher.
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Stack sx={{ gap: 2.5 }}>
            {error && <Alert severity="error">{error}</Alert>}

            {!editing && (
              <Box>
                <Stack direction="row" sx={{ gap: 1, alignItems: 'stretch' }}>
                  <TextField
                    label="Phone number"
                    placeholder="+237 6XX XXX XXX"
                    value={form.msisdn}
                    onChange={(event) => {
                      set('msisdn')(event);
                      setSuggestion(null);
                    }}
                    onBlur={() => msisdnValid && !suggestion && lookUp()}
                    error={form.msisdn !== '' && !msisdnValid}
                    autoFocus
                    fullWidth
                    slotProps={{ htmlInput: { inputMode: 'tel', autoComplete: 'off', 'aria-describedby': 'msisdn-help' } }}
                  />
                  <Button
                    variant="contained"
                    onClick={lookUp}
                    disabled={!msisdnValid || lookingUp}
                    startIcon={lookingUp ? <CircularProgress size={16} color="inherit" /> : <SearchOutlined />}
                    sx={(theme) => ({
                      flexShrink: 0,
                      px: 2.5,
                      whiteSpace: 'nowrap',
                      // Pulses while there's a valid number waiting to be looked up, so it's clear what to do next.
                      ...(msisdnValid &&
                        !suggestion &&
                        !lookingUp && {
                          animation: `${glow(theme.palette.primary.main)} 1.6s ease-in-out infinite`,
                          '@media (prefers-reduced-motion: reduce)': {
                            animation: 'none',
                            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.35)}`
                          }
                        })
                    })}
                  >
                    {lookingUp ? 'Looking up…' : 'Look up'}
                  </Button>
                </Stack>
                <Typography
                  id="msisdn-help"
                  variant="caption"
                  color={form.msisdn !== '' && !msisdnValid ? 'error' : 'text.secondary'}
                  sx={{ display: 'block', mt: 0.75, mx: 1.75 }}
                >
                  International format, starting with + and the country code. Look up fills in the details below.
                </Typography>
                {lookupError && (
                  <Alert severity="warning" sx={{ mt: 1.5 }}>
                    {lookupError}
                  </Alert>
                )}
                {suggestion?.match === 'none' && (
                  <Alert severity="warning" sx={{ mt: 1.5 }}>
                    {SUGGEST_MATCH.none}
                  </Alert>
                )}
                {suggestion && suggestion.match !== 'none' && (
                  <Alert severity="success" sx={{ mt: 1.5 }}>
                    {suggestion.country}
                    {suggestion.operator ? ` · ${suggestion.operator}` : ''}
                    {SUGGEST_MATCH[suggestion.match] ? `. ${SUGGEST_MATCH[suggestion.match]}` : ''}
                  </Alert>
                )}
              </Box>
            )}

            {candidates.length > 1 && (
              <TextField
                select
                label="Network"
                value={candidates.some((item) => item.operator_code === form.operator_code) ? form.operator_code : ''}
                onChange={(event) => pickCandidate(event.target.value)}
                helperText="Best matches first. This sets the operator and operator code."
                fullWidth
              >
                {candidates.map((item) => (
                  <MenuItem key={item.operator_code} value={item.operator_code}>
                    {item.network}{' '}
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1, fontFamily: 'monospace' }}>
                      {item.operator_code}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Country"
                  value={form.country}
                  onChange={set('country')}
                  fullWidth
                  helperText={editing ? ' ' : 'Filled in from the number if left empty'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Operator"
                  value={form.operator}
                  onChange={set('operator')}
                  fullWidth
                  helperText={editing ? ' ' : 'Filled in from the number if left empty'}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Operator code"
                  value={form.operator_code}
                  onChange={(event) => setForm((prev) => ({ ...prev, operator_code: event.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  error={!codeValid}
                  helperText={codeValid ? 'MCC + MNC, e.g. 62401' : '5 or 6 digits'}
                  fullWidth
                  slotProps={{ htmlInput: { inputMode: 'numeric', style: { fontFamily: 'monospace' } } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={KNOWN_PROTOCOLS}
                  value={form.protocols}
                  onChange={(event, value) =>
                    setForm((prev) => ({ ...prev, protocols: [...new Set(value.map((v) => v.trim().toLowerCase()).filter(Boolean))] }))
                  }
                  renderValue={(value, getItemProps) =>
                    value.map((option, index) => {
                      const { key, ...itemProps } = getItemProps({ index });
                      return <Chip key={key} size="small" label={option.toUpperCase()} {...itemProps} />;
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Protocols"
                      error={form.protocols.length === 0}
                      helperText={form.protocols.length === 0 ? 'Add at least one' : 'How messages reach the Publisher'}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={!canSubmit}>
            {submitting ? 'Saving…' : editing ? 'Save changes' : 'Add number'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

GatewayClientDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  client: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
