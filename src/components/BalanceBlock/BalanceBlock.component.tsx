import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { formatWeiAmount } from '../../utils/helpers';
import { BalanceBlockProps } from './BalanceBlock.types';

export const BalanceBlock = ({
  sx,
  label,
  amount,
  children,
  asset = 'FISH',
  aprox = false,
  isLoading = false,
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
    {isLoading ? (
      <Skeleton sx={{ height: '100%', width: '100%' }} />
    ) : (
      <Typography variant="h5" sx={{ mt: 1 }}>
        {aprox && '≈ '}
        {formatWeiAmount(amount)} {asset}
      </Typography>
    )}
    {!isLoading && children && <Box sx={{ mt: 2 }}>{children}</Box>}
  </Container>
);
