import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import { ALL_SCOPES, PERMISSION_GROUPS, withRequiredScopes, withoutOrphanedScopes } from 'utils/scopes';

// assets
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';

// Matches the Publisher's username rule.
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const CANT_GRANT = "You can't give access you don't have yourself";

// ==============================|| PERMISSION PICKER ||============================== //

const ROW_GRID = { display: 'grid', gridTemplateColumns: '1fr 96px 156px', alignItems: 'center', columnGap: 1 };

export function PermissionPicker({ value, onChange, grantable, disabled }) {
  const canGrant = (scope) => grantable.includes(scope);
  const setScope = (scope, on) =>
    onChange(on ? withRequiredScopes([...value, scope]) : withoutOrphanedScopes(value.filter((s) => s !== scope)));

  const isAdmin = ALL_SCOPES.every((scope) => value.includes(scope));
  const canGrantAdmin = ALL_SCOPES.every(canGrant);

  const fullAccess = (
    <Button
      size="small"
      color={isAdmin ? 'secondary' : 'primary'}
      disabled={disabled || (!isAdmin && !canGrantAdmin)}
      onClick={() => onChange(isAdmin ? [] : [...ALL_SCOPES])}
    >
      {isAdmin ? 'Remove all' : 'Grant full access'}
    </Button>
  );

  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 0.25 }}>
            Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isAdmin ? 'Full access: this user will be an administrator.' : 'Managing something includes viewing it.'}
          </Typography>
        </Box>
        {!isAdmin && !canGrantAdmin ? (
          <Tooltip title="Only an administrator can give full access">
            <span>{fullAccess}</span>
          </Tooltip>
        ) : (
          fullAccess
        )}
      </Stack>

      <Box>
        {PERMISSION_GROUPS.map((group) => (
          <Box key={group.id} sx={{ ...ROW_GRID, px: 2, py: 2, '&:not(:last-of-type)': { borderBottom: 1, borderColor: 'divider' } }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1">{group.title}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {group.description}
              </Typography>
            </Box>
            {group.permissions.map((permission) => {
              const locked = !canGrant(permission.scope);
              return (
                <Tooltip
                  key={permission.scope}
                  title={locked ? CANT_GRANT : `${permission.label}: ${permission.hint}`}
                  placement="top"
                  enterDelay={400}
                >
                  <FormControlLabel
                    disabled={disabled || locked}
                    control={
                      <Checkbox
                        size="small"
                        checked={value.includes(permission.scope)}
                        onChange={(event) => setScope(permission.scope, event.target.checked)}
                      />
                    }
                    label={<Typography variant="body2">{permission.short}</Typography>}
                    sx={{ mr: 0, ml: -0.5, whiteSpace: 'nowrap' }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

PermissionPicker.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  grantable: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool
};

// ==============================|| ADD / EDIT USER ||============================== //

export function CredentialFormDialog({ open, credential, grantable, onClose, onSubmit }) {
  const editing = Boolean(credential);
  const [username, setUsername] = useState('');
  const [scopes, setScopes] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setUsername(credential?.username ?? '');
    setScopes(credential?.scopes ?? []);
    setError('');
    setSubmitting(false);
  }, [open, credential]);

  const usernameInvalid = !editing && username !== '' && !USERNAME_PATTERN.test(username);
  const canSubmit = scopes.length > 0 && (editing || USERNAME_PATTERN.test(username)) && !submitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ username, scopes });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="sm" fullWidth scroll="paper">
      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        <DialogTitle>
          {editing ? `Change access for ${credential.username}` : 'Add a user'}
          {/* {!editing && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              They get a password to sign in to this dashboard. You&apos;ll see it once, after adding them.
            </Typography>
          )} */}
        </DialogTitle>
        <DialogContent dividers>
          <Stack sx={{ gap: 3, mb: 5, mt: 3 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {!editing && (
              <TextField
                label="Username"
                sx={{ mb: 2 }}
                placeholder="e.g. jane.doe"
                value={username}
                onChange={(event) => setUsername(event.target.value.toLowerCase())}
                error={usernameInvalid}
                helperText="3 to 32 lowercase letters, numbers, dots, dashes or underscores. Starts with a letter or number."
                autoFocus
                fullWidth
                slotProps={{ htmlInput: { maxLength: 32, autoComplete: 'off', spellCheck: false } }}
              />
            )}
            <PermissionPicker value={scopes} onChange={setScopes} grantable={grantable} disabled={submitting} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Typography variant="caption" color={scopes.length ? 'text.secondary' : 'warning.main'}>
            {scopes.length ? `${scopes.length} of ${ALL_SCOPES.length} permissions` : 'Pick at least one permission'}
          </Typography>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Button color="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={!canSubmit}>
              {submitting ? 'Saving…' : editing ? 'Save access' : 'Add user'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}

CredentialFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  credential: PropTypes.object,
  grantable: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

// ==============================|| ONE-TIME PASSWORD ||============================== //

export function PasswordDialog({ result, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => setCopied(false), [result]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.password);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog open={Boolean(result)} maxWidth="xs" fullWidth>
      <DialogTitle>Password for {result?.username}</DialogTitle>
      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This is the only time this password is shown. Copy it now and send it to them privately.
        </Alert>
        <TextField
          value={result?.password ?? ''}
          fullWidth
          slotProps={{
            htmlInput: { readOnly: true, style: { fontFamily: 'monospace' }, onFocus: (event) => event.target.select() },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={copy} aria-label="Copy password" edge="end">
                    {copied ? <CheckOutlined /> : <CopyOutlined />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          {copied ? 'Done' : "I've saved it"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PasswordDialog.propTypes = {
  result: PropTypes.shape({ username: PropTypes.string, password: PropTypes.string }),
  onClose: PropTypes.func.isRequired
};

// ==============================|| CONFIRM ||============================== //

export function ConfirmDialog({ action, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setBusy(false);
    setError('');
  }, [action]);

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await action.run();
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Dialog open={Boolean(action)} onClose={busy ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{action?.title}</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="body2">{action?.message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="contained" color={action?.danger ? 'error' : 'primary'} onClick={confirm} disabled={busy}>
          {busy ? 'Working…' : action?.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  action: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.node,
    confirmLabel: PropTypes.string,
    danger: PropTypes.bool,
    run: PropTypes.func
  }),
  onClose: PropTypes.func.isRequired
};
