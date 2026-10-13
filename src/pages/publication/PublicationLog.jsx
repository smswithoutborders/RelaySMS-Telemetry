import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import { useAuth } from 'contexts/AuthContext';
import { SCOPES } from 'utils/scopes';
import { rangeLabel } from 'utils/publications';
import { useFilterOptions } from 'sections/publications/usePublicationStats';
import usePublicationFilters from 'sections/publications/usePublicationFilters';
import PublicationFilters from 'sections/publications/PublicationFilters';
import PublicationTable from 'sections/publications/PublicationTable';
import ExportButton from 'sections/publications/ExportButton';

// assets
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';

// ==============================|| PUBLICATION LOG ||============================== //

export default function PublicationLog() {
  const { hasScope } = useAuth();
  const withReasons = hasScope(SCOPES.STATS_REASONS);
  const { filterValue, setFilterValue, reset, refresh, range, listFilters, filtersKey, search } = usePublicationFilters();
  const options = useFilterOptions(range);

  return (
    <Grid container rowSpacing={3} columnSpacing={2.75}>
      <Grid size={12}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-start' }, gap: 1 }}>
          <Box>
            <Typography variant="h5">Publication log</Typography>
            <Typography variant="body2" color="text.secondary">
              Every publish attempt, newest first, {rangeLabel(filterValue.range, filterValue.customRange).toLowerCase()}
            </Typography>
          </Box>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
            <Button component={RouterLink} to={`/${search}`} startIcon={<ArrowLeftOutlined />} color="secondary">
              Overview
            </Button>
            <ExportButton filters={listFilters} />
          </Stack>
        </Stack>
      </Grid>

      <Grid size={12}>
        <PublicationFilters value={filterValue} options={options} onChange={setFilterValue} onReset={reset} onRefresh={refresh} />
      </Grid>

      <Grid size={12}>
        <MainCard content={false}>
          <Box sx={{ p: 1.5 }}>
            <PublicationTable filters={listFilters} filtersKey={filtersKey} withReasons={withReasons} />
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}
