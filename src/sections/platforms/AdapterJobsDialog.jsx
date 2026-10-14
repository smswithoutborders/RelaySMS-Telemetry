import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// material-ui
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import Loader from 'components/Loader';
import { getErrorMessage } from 'api/admin';
import { listAdapterJobs } from 'api/publisher';
import { ADAPTER_JOB_ACTIONS } from 'utils/backendLabels';
import { JobLog, JobStateChip, jobVersionText } from './AdapterJobProgress';

// assets
import DownOutlined from '@ant-design/icons/DownOutlined';

dayjs.extend(relativeTime);

// ==============================|| ADAPTER INSTALL HISTORY ||============================== //

export default function AdapterJobsDialog({ open, adapter, onClose }) {
  const [state, setState] = useState({ loading: true, error: '', jobs: [] });

  useEffect(() => {
    if (!open || !adapter) return undefined;
    const controller = new AbortController();
    setState({ loading: true, error: '', jobs: [] });
    listAdapterJobs(adapter.id, { signal: controller.signal })
      .then((jobs) => setState({ loading: false, error: '', jobs }))
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({ loading: false, error: getErrorMessage(err, "We couldn't load the install history."), jobs: [] });
      });
    return () => controller.abort();
  }, [open, adapter]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle>
        Install history: {adapter?.display_name || adapter?.name}
        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          The last 20 installs and updates, newest first.
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {state.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <Loader size={36} fullScreen={false} />
          </Box>
        ) : state.error ? (
          <Alert severity="error">{state.error}</Alert>
        ) : state.jobs.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No installs or updates recorded yet.
          </Typography>
        ) : (
          <Stack sx={{ gap: 1 }}>
            {state.jobs.map((job) => (
              <Accordion
                key={job.id}
                disableGutters
                elevation={0}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1, '&::before': { display: 'none' } }}
              >
                <AccordionSummary expandIcon={<DownOutlined />}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, flexWrap: 'wrap', minWidth: 0 }}>
                    <JobStateChip state={job.state} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {ADAPTER_JOB_ACTIONS[job.action] || job.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {jobVersionText(job)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" title={dayjs(job.created_at).format('MMM D, YYYY HH:mm')}>
                      {dayjs(job.created_at).fromNow()}
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  {job.log ? <JobLog log={job.log} maxHeight={240} /> : <Typography color="text.secondary">No log.</Typography>}
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AdapterJobsDialog.propTypes = { open: PropTypes.bool.isRequired, adapter: PropTypes.object, onClose: PropTypes.func.isRequired };
