import { Link } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { Urls } from '../../constants';

export const ProposalDetailsFailure = () => (
  <Box sx={{ wdith: '100%', textAlign: 'center' }}>
    <Typography color="error">Unable to find the proposal</Typography>
    <Button
      component={Link}
      to={Urls.Bitocracy}
      variant="outlined"
      sx={{ mt: 2 }}
    >
      Go To Proposal List
    </Button>
  </Box>
);
