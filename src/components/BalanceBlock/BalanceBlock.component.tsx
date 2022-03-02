import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { formatWeiAmount } from '../../utils/helpers';

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
  aprox = false,
  asset = 'FISH',
}: BalanceBlockProps) => {
  const isUpdate = state === 'loading' && !!data;

  return (
    <Container
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <Typography variant="h4" component="div" sx={{ display: 'flex' }}>
        {label}
        {isUpdate && (
          <CircularProgress size={16} color="primary" sx={{ ml: 1 }} />
        )}
      </Typography>

      <BalanceBlockContent
        data={data}
        state={state}
        asset={asset}
        aprox={aprox}
      />
      {(state === 'success' || isUpdate) && children && (
        <Box sx={{ mt: 2 }}>{children}</Box>
      )}
    </Container>
  );
};

const BalanceBlockContent = ({
  data,
  state,
  asset,
  aprox,
}: BalanceBlockContentProps) => {
  if (state === 'loading' && !data) {
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
      {aprox && '≈ '}
      {formatWeiAmount(data ?? 0)} {asset}
    </Typography>
  );
};
