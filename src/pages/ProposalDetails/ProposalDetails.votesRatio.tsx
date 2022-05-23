import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  hasVotesSelector,
  votesRatioSelector,
} from '../../store/proposals/proposals.selectors';
import { CenteredBox } from '../../components/PageView/PageView.component';

const halfwayColor = '#B78367';

export const VotesRatioBlock = () => {
  const votesRatio = useSelector(votesRatioSelector);
  const hasVotes = useSelector(hasVotesSelector);

  if (!hasVotes || votesRatio === undefined) {
    return null;
  }

  return (
    <CenteredBox>
      <Typography variant="h6" sx={{ mr: 2, fontWeight: 'bold' }}>
        {votesRatio.toFixed(2)}%
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          height: 14,
          position: 'relative',
          borderRadius: '8px',
          backgroundImage: ({ palette }) =>
            `linear-gradient(to right, ${halfwayColor} ${votesRatio}%, ${
              palette.error.main
            } ${votesRatio + 5}%)`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: `${votesRatio}%`,
            height: 14,
            borderRadius: '8px',
            background: ({ palette }) =>
              `linear-gradient(to right, ${palette.success.main} ${votesRatio}%, #B78367 100%)`,
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
        {(100 - votesRatio).toFixed(2)}%
      </Typography>
    </CenteredBox>
  );
};
