import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project imports
import Loader from 'components/Loader';
import ErrorDisplay from 'components/ErrorDisplay';
import CountryFlag from 'components/CountryFlag';
import PlatformLogo from 'components/PlatformLogo';
import { label } from 'utils/backendLabels';
import { getErrorMessage } from 'api/admin';
import { listPublications } from 'api/publisher';
import { countryName, platformLabel, protocolLabel } from 'utils/publications';

// assets
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';

const PAGE_SIZES = [10, 25, 50, 100];

// ==============================|| PUBLICATIONS TABLE ||============================== //

export function PlatformCell({ name }) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, color: name ? 'inherit' : 'text.secondary' }}>
      <PlatformLogo name={name} />
      <span>{platformLabel(name)}</span>
    </Stack>
  );
}

PlatformCell.propTypes = { name: PropTypes.string };

export function StatusChip({ status }) {
  const fill = status === 'published' ? 'success.dark' : status === 'failed' ? 'error.dark' : 'secondary.main';
  return <Chip size="small" label={label.status(status)} sx={{ bgcolor: fill, color: '#fff', fontWeight: 500 }} />;
}

StatusChip.propTypes = { status: PropTypes.string };

export default function PublicationTable({ filters, filtersKey, withReasons, preview }) {
  const [pageSize, setPageSize] = useState(25);
  const limit = preview || pageSize;
  const [cursorFor, setCursorFor] = useState({ query: '', cursor: null });
  const [page, setPage] = useState({ data: [], nextCursor: null, prevCursor: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const query = `${filtersKey}|${limit}`;
  const cursor = cursorFor.query === query ? cursorFor.cursor : null;
  const setCursor = (next) => setCursorFor({ query, cursor: next });

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    listPublications({ filters, limit, cursor }, { signal: controller.signal })
      .then((result) => {
        setPage(result);
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(err, "We couldn't load publications."));
        setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, cursor, reloadKey]);

  const columns = withReasons ? 6 : 5;

  return (
    <>
      <TableContainer sx={{ maxHeight: preview ? 'none' : 560 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>Protocol</TableCell>
              <TableCell>Status</TableCell>
              {withReasons && <TableCell>Failure reason</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns} sx={{ border: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <Loader size={40} fullScreen={false} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns} sx={{ border: 0 }}>
                  <ErrorDisplay message={error} onRetry={() => setReloadKey((key) => key + 1)} />
                </TableCell>
              </TableRow>
            ) : page.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns} sx={{ border: 0 }}>
                  <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                    No publications match these filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              page.data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap' }} title={row.created_at}>
                    {dayjs(row.created_at).format('MMM D, YYYY HH:mm:ss')}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                      <CountryFlag code={row.country_code} size={20} />
                      {row.country_code ? (
                        countryName(row.country_code)
                      ) : (
                        <Typography variant="body2" color="text.secondary" component="span">
                          Unknown
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <PlatformCell name={row.platform_name} />
                  </TableCell>
                  <TableCell>{protocolLabel(row.protocol)}</TableCell>
                  <TableCell>
                    <StatusChip status={row.status} />
                  </TableCell>
                  {withReasons && (
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography variant="body2" color="text.secondary" noWrap title={row.failure_reason || ''}>
                        {row.failure_reason ? label.failureReason(row.failure_reason) : '—'}
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!preview && (
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end', gap: 2, pt: 1.5, px: 1 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Rows per page
            </Typography>
            <Select size="small" value={pageSize} onChange={(event) => setPageSize(event.target.value)} variant="standard" disableUnderline>
              {PAGE_SIZES.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          <IconButton aria-label="Newer publications" disabled={loading || !page.prevCursor} onClick={() => setCursor(page.prevCursor)}>
            <LeftOutlined />
          </IconButton>
          <IconButton aria-label="Older publications" disabled={loading || !page.nextCursor} onClick={() => setCursor(page.nextCursor)}>
            <RightOutlined />
          </IconButton>
        </Stack>
      )}
    </>
  );
}

PublicationTable.propTypes = {
  filters: PropTypes.object.isRequired,
  filtersKey: PropTypes.string.isRequired,
  withReasons: PropTypes.bool,
  preview: PropTypes.number
};
