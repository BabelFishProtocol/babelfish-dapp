import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

import { PageView } from '../../components/PageView/PageView.component';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs.component';
import { UrlNames, Urls } from '../../constants';

export const ProposalDetailsLoadable = () => (
  <>
    <Breadcrumbs
      links={[
        { title: UrlNames.Proposals, href: Urls.Proposals },
        { title: UrlNames.ProposalDetails },
      ]}
    />
    <PageView
      title={
        <Box sx={{ p: 1 }}>
          <Skeleton sx={{ height: '100%', width: '100%' }} />
        </Box>
      }
    >
      <Grid container>
        <LoadingBlock />
        <LoadingBlock />
        <LoadingBlock />
        <LoadingBlock />
      </Grid>
    </PageView>
  </>
);

const LoadingBlock = () => (
  <Grid item sm={6} p={1}>
    <Container sx={{ p: 2, mt: 2, minHeight: 300 }}>
      <Skeleton sx={{ height: '100%', width: '100%' }} />
    </Container>
  </Grid>
);
