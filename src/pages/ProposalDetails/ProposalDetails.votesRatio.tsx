import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CenteredBox } from '../../components/PageView/PageView.component';
import { VotesRatioBlockProps } from './ProposalDetails.types';

export const VotesRatioBlock = ({ votesRatio }: VotesRatioBlockProps) => (
  <CenteredBox>
    <Typography variant="h5" sx={{ m: 1, fontSize: `33px !important` }}>
      {votesRatio}%
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        height: 14,
        position: 'relative',
        borderRadius: '8px',
        backgroundImage: ({ palette }) =>
          `linear-gradient(to right, ${palette.error.light}, ${palette.error.dark} 90%);`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: `${votesRatio}%`,
          height: 14,
          borderRadius: '8px',
          backgroundImage: ({ palette }) =>
            `linear-gradient(to right, ${palette.success.light}, ${palette.success.dark} 90%);`,
        }}
      />
    </Box>
    <Typography variant="h5" sx={{ m: 1, fontSize: `33px !important` }}>
      {100 - votesRatio}%
    </Typography>
  </CenteredBox>
);
