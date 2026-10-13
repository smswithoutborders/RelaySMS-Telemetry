import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// antd
import { Button, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

// project imports
import { getErrorMessage } from 'api/admin';
import { listPublications } from 'api/publisher';

const EXPORT_PAGE_SIZE = 200;
const EXPORT_MAX_ROWS = 50000;

function toCsv(rows) {
  const columns = ['id', 'created_at', 'status', 'platform_name', 'protocol', 'country_code', 'failure_reason'];
  const escape = (value) => {
    if (value === null || value === undefined) return '';
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [columns.join(','), ...rows.map((row) => columns.map((column) => escape(row[column])).join(','))].join('\n');
}

function saveFile(content, type, filename) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ==============================|| EXPORT PUBLICATIONS ||============================== //

// Downloads every row matching the filters by following the API's cursors, up to EXPORT_MAX_ROWS.
export default function ExportButton({ filters }) {
  const [exporting, setExporting] = useState(null);
  const [message, setMessage] = useState('');

  const handleExport = async (format) => {
    setMessage('');
    setExporting(0);
    try {
      const rows = [];
      let cursor = null;
      do {
        const page = await listPublications({ filters, limit: EXPORT_PAGE_SIZE, cursor });
        rows.push(...page.data);
        setExporting(rows.length);
        cursor = page.nextCursor;
      } while (cursor && rows.length < EXPORT_MAX_ROWS);

      const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      if (format === 'csv') {
        saveFile(toCsv(rows), 'text/csv', `publications-${stamp}.csv`);
      } else {
        const metadata = { exported_at: new Date().toISOString(), total_records: rows.length, truncated: Boolean(cursor), filters };
        saveFile(JSON.stringify({ metadata, publications: rows }, null, 2), 'application/json', `publications-${stamp}.json`);
      }
      if (cursor) setMessage(`Export stopped at ${EXPORT_MAX_ROWS.toLocaleString()} rows. Narrow the date range to export the rest.`);
    } catch (err) {
      setMessage(getErrorMessage(err, 'The export failed. Please try again.'));
    } finally {
      setExporting(null);
    }
  };

  return (
    <Stack sx={{ gap: 1, alignItems: 'flex-end' }}>
      <Dropdown
        trigger={['click']}
        disabled={exporting !== null}
        menu={{
          items: [
            { key: 'csv', label: 'CSV' },
            { key: 'json', label: 'JSON' }
          ],
          onClick: ({ key }) => handleExport(key)
        }}
      >
        <Button icon={<DownloadOutlined />} loading={exporting !== null}>
          {exporting !== null ? `Exporting… ${exporting.toLocaleString()}` : 'Export'}
        </Button>
      </Dropdown>
      {message && (
        <Alert severity="warning" onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}
    </Stack>
  );
}

ExportButton.propTypes = { filters: PropTypes.object.isRequired };
