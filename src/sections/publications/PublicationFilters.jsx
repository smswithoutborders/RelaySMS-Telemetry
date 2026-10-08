import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// antd
import { Button, DatePicker, Select, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

// project imports
import PlatformLogo from 'components/PlatformLogo';
import { PUBLICATION_STATUS } from 'utils/backendLabels';
import MainCard from 'components/MainCard';
import { RANGE_PRESETS, countryFlag, countryName, platformLabel, protocolLabel } from 'utils/publications';

// ==============================|| PUBLICATION FILTERS ||============================== //

export default function PublicationFilters({ value, options, onChange, onReset, onRefresh }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const set = (key) => (next) => onChange({ ...value, [key]: next || '' });

  const withSelected = (list, selected) => (selected && !list.includes(selected) ? [selected, ...list] : list);

  return (
    <MainCard contentSX={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Space wrap size="middle">
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
          placeholder="Status"
          value={value.status || undefined}
          onChange={set('status')}
          style={{ width: 130 }}
          allowClear
          options={[...Object.entries(PUBLICATION_STATUS).map(([value, text]) => ({ value, label: text }))]}
        />
        <Select
          placeholder="Platform"
          value={value.platform_name || undefined}
          onChange={set('platform_name')}
          style={{ width: 170 }}
          allowClear
          options={withSelected(options.platforms, value.platform_name).map((name) => {
            return {
              value: name,
              label: (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlatformLogo name={name} />
                  <span>{platformLabel(name)}</span>
                </Box>
              )
            };
          })}
        />
        <Select
          placeholder="Protocol"
          value={value.protocol || undefined}
          onChange={set('protocol')}
          style={{ width: 130 }}
          allowClear
          options={withSelected(options.protocols, value.protocol).map((name) => ({ value: name, label: protocolLabel(name) }))}
        />
        <Select
          placeholder="Country"
          value={value.country_code || undefined}
          onChange={set('country_code')}
          style={{ width: 200 }}
          allowClear
          showSearch
          optionFilterProp="search"
          options={withSelected(options.countries, value.country_code)
            .map((code) => ({ value: code, search: countryName(code), label: `${countryFlag(code)} ${countryName(code)}` }))
            .sort((a, b) => a.search.localeCompare(b.search))}
        />
        <Button type="text" icon={<ReloadOutlined />} onClick={onRefresh} title="Reload with the latest data">
          Refresh
        </Button>
        <Button type="link" onClick={onReset}>
          Reset filters
        </Button>
      </Space>
    </MainCard>
  );
}

PublicationFilters.propTypes = {
  value: PropTypes.shape({
    range: PropTypes.string.isRequired,
    customRange: PropTypes.array,
    status: PropTypes.string,
    platform_name: PropTypes.string,
    protocol: PropTypes.string,
    country_code: PropTypes.string
  }).isRequired,
  options: PropTypes.shape({
    platforms: PropTypes.arrayOf(PropTypes.string),
    protocols: PropTypes.arrayOf(PropTypes.string),
    countries: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};
