import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CenteredBox } from '../../../components/PageView/PageView.component';

import { VoteActionBlockProps } from './VotesBlock.types';

export const VoteActionBlock = ({
  votesAmount,
  children,
}: VoteActionBlockProps) => (
  <Box
    sx={{
      gap: 2,
      height: 50,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <CenteredBox
      sx={{
        p: 1,
        flexGrow: 1,
        borderRadius: '8px',
        backgroundColor: ({ palette }) => palette.borderGrey.dark,
      }}
    >
      <Typography variant="body1">{votesAmount}</Typography>
    </CenteredBox>
    {children}
  </Box>
);
