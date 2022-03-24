import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  hasVotesSelector,
  votesRatioSelector,
} from '../../store/proposals/proposals.selectors';
import { CenteredBox } from '../../components/PageView/PageView.component';

export const VotesRatioBlock = () => {
  const votesRatio = useSelector(votesRatioSelector);
  const hasVotes = useSelector(hasVotesSelector);

  if (!hasVotes || votesRatio === undefined) {
    return null;
  }

  return (
    <CenteredBox>
      <Typography variant="h5" sx={{ m: 1, fontSize: `33px !important` }}>
        {votesRatio.toFixed(2)}%
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
        {(100 - votesRatio).toFixed(2)}%
      </Typography>
    </CenteredBox>
  );
};
