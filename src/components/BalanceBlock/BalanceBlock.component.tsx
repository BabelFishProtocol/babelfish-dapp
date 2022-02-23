import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {
  BalanceBlockProps,
  BalanceBlockContentProps,
} from './BalanceBlock.types';

export const BalanceBlock = ({
  sx,
  label,
  data,
  state,
  children,
  asset = 'FISH',
}: BalanceBlockProps) => (
  <Container
    sx={{
      padding: 2,
      display: 'flex',
      flexDirection: 'column',
      ...sx,
    }}
  >
    <Typography variant="h4">{label}</Typography>
    <BalanceBlockContent data={data} state={state} asset={asset} />
    {state === 'success' && children && <Box sx={{ mt: 2 }}>{children}</Box>}
  </Container>
);

const BalanceBlockContent = ({
  data,
  state,
  asset,
}: BalanceBlockContentProps) => {
  if (state === 'loading') {
    return <Skeleton sx={{ height: '100%', width: '100%' }} />;
  }

  if (state === 'failure') {
    return (
      <Typography sx={{ mt: 1 }} color="error">
        Unable to load data!
      </Typography>
    );
  }

  return (
    <Typography variant="h5" sx={{ mt: 1 }}>
      {data} {asset}
    </Typography>
  );
};
