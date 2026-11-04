import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// antd
import { Button, DatePicker, Select, Space, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

// project imports
import CountryFlag from 'components/CountryFlag';
import PlatformLogo from 'components/PlatformLogo';
import { PUBLICATION_STATUS } from 'utils/backendLabels';
import MainCard from 'components/MainCard';
import { RANGE_PRESETS, countryName, platformLabel, protocolLabel } from 'utils/publications';

// The chosen values first, so one that has no data in these dates can still be seen and removed.
const withSelected = (list, selected) => [...new Set([...selected, ...list])];
const byName = (a, b) => a.search.localeCompare(b.search);

// A filter option: `icon` beside the text in the list, `search` is what typing matches.
function option(value, text, icon) {
  return {
    value,
    search: text,
    label: icon ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        <span>{text}</span>
      </Box>
    ) : (
      text
    )
  };
}

// The tag for a chosen value. `short` keeps it compact (a country's code); the full name shows on hover.
function tagRenderer({ icon, short, full }) {
  function FilterTag({ value, closable, onClose }) {
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        onMouseDown={(event) => event.preventDefault()}
        title={full(value)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginInlineEnd: 4, marginBlock: 2 }}
      >
        {icon?.(value)}
        {short(value)}
      </Tag>
    );
  }
  FilterTag.propTypes = { value: PropTypes.string, closable: PropTypes.bool, onClose: PropTypes.func };
  return FilterTag;
}

const statusTag = tagRenderer({
  short: (value) => PUBLICATION_STATUS[value] ?? value,
  full: (value) => PUBLICATION_STATUS[value] ?? value
});
const platformTag = tagRenderer({
  icon: (name) => <PlatformLogo name={name} size={14} />,
  short: platformLabel,
  full: platformLabel
});
const protocolTag = tagRenderer({ short: protocolLabel, full: protocolLabel });
// Image flags: emoji flags don't render on Windows or in Chrome on Linux.
const countryTag = tagRenderer({ icon: (code) => <CountryFlag code={code} size={14} />, short: (code) => code, full: countryName });
const countryOption = (code) => option(code, countryName(code), <CountryFlag code={code} size={16} />);

// ==============================|| PUBLICATION FILTERS ||============================== //

export default function PublicationFilters({ value, options, onChange, onReset, onRefresh, busy = false }) {
  const set = (key) => (next) => onChange({ ...value, [key]: next ?? [] });
  const included = value.country_code;
  const excluded = value.exclude_country_code;
  const removeExcluded = (code) => onChange({ ...value, exclude_country_code: excluded.filter((item) => item !== code) });

  const multi = (key, placeholder, width) => ({
    mode: 'multiple',
    className: 'filter-multi',
    placeholder,
    value: value[key],
    onChange: set(key),
    style: { width },
    allowClear: true,
    optionFilterProp: 'search'
  });

  return (
    <MainCard contentSX={{ p: 2, '&:last-child': { pb: 2 } }} sx={{ position: 'relative', overflow: 'hidden' }} aria-busy={busy}>
      {busy && <LinearProgress aria-label="Loading results" sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3 }} />}
      <Space wrap size="middle" align="start">
        <Select
          value={value.range}
          onChange={(range) => onChange({ ...value, range })}
          style={{ width: 170 }}
          options={[...RANGE_PRESETS.map(({ key, label }) => ({ value: key, label })), { value: 'custom', label: 'Custom range' }]}
        />
        {value.range === 'custom' && (
          <DatePicker.RangePicker
            value={value.customRange}
            onChange={(customRange) => onChange({ ...value, customRange })}
            disabledDate={(date) => date.isAfter(new Date())}
            allowClear={false}
          />
        )}
        <Select
          {...multi('status', 'Status', 190)}
          tagRender={statusTag}
          options={Object.entries(PUBLICATION_STATUS).map(([status, text]) => option(status, text))}
        />
        <Select
          {...multi('platform_name', 'Platform', 220)}
          tagRender={platformTag}
          options={withSelected(options.platforms, value.platform_name).map((name) =>
            option(name, platformLabel(name), <PlatformLogo name={name} />)
          )}
        />
        <Select
          {...multi('protocol', 'Protocol', 160)}
          tagRender={protocolTag}
          options={withSelected(options.protocols, value.protocol).map((name) => option(name, protocolLabel(name)))}
        />
        <Select
          {...multi('country_code', 'Country', 220)}
          tagRender={countryTag}
          options={withSelected(options.countries, included)
            .filter((code) => !excluded.includes(code))
            .map(countryOption)
            .sort(byName)}
        />
        <Select
          {...multi('exclude_country_code', 'Exclude countries', 220)}
          tagRender={countryTag}
          options={withSelected(options.countries, excluded)
            .filter((code) => !included.includes(code))
            .map(countryOption)
            .sort(byName)}
        />
        <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} title="Reload with the latest data">
          Refresh
        </Button>
        <Button type="link" onClick={onReset}>
          Reset filters
        </Button>
      </Space>
      {excluded.length > 0 && (
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Leaving out {excluded.length === 1 ? '1 country' : `${excluded.length} countries`}:
          </Typography>
          {excluded.map((code) => (
            <Chip
              key={code}
              size="small"
              variant="outlined"
              avatar={<CountryFlag code={code} size={18} />}
              label={countryName(code)}
              onDelete={() => removeExcluded(code)}
            />
          ))}
          <Button type="link" size="small" onClick={() => onChange({ ...value, exclude_country_code: [] })}>
            Include all
          </Button>
        </Stack>
      )}
    </MainCard>
  );
}

PublicationFilters.propTypes = {
  value: PropTypes.shape({
    range: PropTypes.string.isRequired,
    customRange: PropTypes.array,
    status: PropTypes.arrayOf(PropTypes.string).isRequired,
    platform_name: PropTypes.arrayOf(PropTypes.string).isRequired,
    protocol: PropTypes.arrayOf(PropTypes.string).isRequired,
    country_code: PropTypes.arrayOf(PropTypes.string).isRequired,
    exclude_country_code: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  options: PropTypes.shape({
    platforms: PropTypes.arrayOf(PropTypes.string),
    protocols: PropTypes.arrayOf(PropTypes.string),
    countries: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  busy: PropTypes.bool
};
