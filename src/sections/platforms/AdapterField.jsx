import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// material-ui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import { ADAPTER_FIELD_TYPES, humanize } from 'utils/backendLabels';

// assets
import UploadOutlined from '@ant-design/icons/UploadOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

const MAX_FILE_BYTES = 64 * 1024;

// Text in the box → the value the API takes for this field type. Returns undefined when the box is left empty.
export function parseFieldValue(field, raw) {
  if (field.type === 'boolean') return Boolean(raw);
  if (raw === undefined || raw === null || raw === '') return undefined;
  if (field.type === 'integer') return Number(raw);
  // Lists are kept as an array of chips in the form.
  if (field.type === 'list') {
    const items = (Array.isArray(raw) ? raw : String(raw).split(/[\n,]/)).map((item) => String(item).trim()).filter(Boolean);
    return items.length ? items : undefined;
  }
  return String(raw);
}

export function fieldText(field, value) {
  if (field.type === 'list') return Array.isArray(value) ? value.map(String) : value ? [String(value)] : [];
  if (value === null || value === undefined) return field.type === 'boolean' ? false : '';
  return field.type === 'boolean' ? Boolean(value) : String(value);
}

export function fieldError(field, raw) {
  if (field.type === 'integer' && raw !== '' && raw !== undefined && !/^-?\d+$/.test(String(raw).trim())) return 'A whole number';
  return '';
}

function ListField({ label, help, value, onChange, disabled }) {
  const [draft, setDraft] = useState('');
  const add = (text) => {
    const items = String(text)
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (!items.length) return;
    onChange([...new Set([...value, ...items])]);
    setDraft('');
  };

  return (
    <Autocomplete
      multiple
      freeSolo
      disabled={disabled}
      options={[]}
      value={value}
      inputValue={draft}
      onInputChange={(event, next, reason) => {
        if (reason === 'reset') return;
        if (/[,\n]/.test(next)) add(next);
        else setDraft(next);
      }}
      onChange={(event, next) => onChange(next.map((item) => String(item).trim()).filter(Boolean))}
      onBlur={() => add(draft)}
      renderValue={(items, getItemProps) =>
        items.map((item, index) => {
          const { key, ...itemProps } = getItemProps({ index });
          return <Chip key={key} size="small" label={item} sx={{ fontFamily: 'monospace', maxWidth: '100%' }} {...itemProps} />;
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={value.length ? 'Add another' : 'Type one, then press Enter'}
          helperText={[help, ADAPTER_FIELD_TYPES.list].filter(Boolean).join(' ')}
        />
      )}
    />
  );
}

ListField.propTypes = {
  label: PropTypes.string,
  help: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

// ==============================|| ADAPTER SETTING / SETUP FIELD ||============================== //

export default function AdapterField({ field, value, onChange, disabled }) {
  const fileInput = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [fileNote, setFileNote] = useState('');
  const label = `${humanize(field.name)}${field.required ? ' *' : ''}`;
  const help = [
    field.description,
    field.secret && (field.is_set ? 'Saved and hidden. Type a new value to replace it.' : 'Hidden once saved.')
  ]
    .filter(Boolean)
    .join(' ');

  if (field.type === 'boolean') {
    return (
      <Box>
        <FormControlLabel
          disabled={disabled}
          control={<Switch checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />}
          label={label}
        />
        {field.description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 6 }}>
            {field.description}
          </Typography>
        )}
      </Box>
    );
  }

  if (field.type === 'file') {
    const pick = (event) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      if (file.size > MAX_FILE_BYTES) {
        setFileNote(`${file.name} is too big. The limit is 64 KB.`);
        return;
      }
      file.text().then((text) => {
        onChange(text);
        setFileNote(`${file.name} (${Math.ceil(file.size / 1024)} KB)`);
      });
    };
    return (
      <Box>
        <Typography variant="body2" sx={{ mb: 0.75 }}>
          {label}
        </Typography>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<UploadOutlined />} onClick={() => fileInput.current?.click()} disabled={disabled}>
            Choose file
          </Button>
          <Typography variant="body2" color={fileNote.includes('too big') ? 'error' : 'text.secondary'}>
            {fileNote || (value ? 'File loaded' : 'No file chosen')}
          </Typography>
          <input ref={fileInput} type="file" hidden onChange={pick} />
        </Stack>
        {field.description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {field.description} The file is read as text, up to 64 KB.
          </Typography>
        )}
      </Box>
    );
  }

  if (field.type === 'list') {
    return (
      <ListField label={label} help={field.description} value={Array.isArray(value) ? value : []} onChange={onChange} disabled={disabled} />
    );
  }

  const error = fieldError(field, value);
  return (
    <TextField
      label={label}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      type={field.secret && !revealed ? 'password' : 'text'}
      placeholder={field.secret && field.is_set ? '••••••••' : undefined}
      error={Boolean(error)}
      helperText={error || help || ' '}
      disabled={disabled}
      fullWidth
      slotProps={{
        input: field.secret
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    aria-label={revealed ? `Hide ${label}` : `Show ${label}`}
                    title={revealed ? 'Hide' : 'Show what you typed'}
                    onClick={() => setRevealed((prev) => !prev)}
                  >
                    {revealed ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </IconButton>
                </InputAdornment>
              )
            }
          : undefined,
        htmlInput: {
          autoComplete: field.secret ? 'new-password' : 'off',
          spellCheck: false,
          inputMode: field.type === 'integer' ? 'numeric' : undefined
        }
      }}
    />
  );
}

AdapterField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.arrayOf(PropTypes.string)]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};
