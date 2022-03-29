import { Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';
import { formatUnitAmount } from '../../../utils/helpers';
import { TokenBalanceProps } from './SendAmount.types';

export const TokenBalance = ({
  startingTokenName,
  startingTokenBalanceState,
  startingTokenBalance,
  startingTokenDecimals,
}: TokenBalanceProps) => (
  <Typography variant="subtitle2" sx={{ position: 'absolute', top: 14 }}>
    {`Available Balance: `}
    {startingTokenBalanceState === 'loading' ? (
      <Skeleton sx={{ width: '8ch', display: 'inline-block' }} />
    ) : (
      `${formatUnitAmount(
        startingTokenBalance || 0,
        startingTokenDecimals || 18,
        2
      )} 
        ${startingTokenName}`
    )}
  </Typography>
);
