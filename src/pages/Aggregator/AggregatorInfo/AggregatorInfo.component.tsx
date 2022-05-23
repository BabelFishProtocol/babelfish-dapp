import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import exchangeIcon from '../../../assets/icons/exchange.svg';
import { formatUnitAmount } from '../../../utils/helpers';
import { AggregatorInfoComponentProps } from './AggregatorInfo.types';
import { InfoRow } from './InfoRow.component';

export const AggregatorInfoComponent = ({
  onClick,
  state,
  feesAndLimits,
  tokenName,
  tokenDecimals,
}: AggregatorInfoComponentProps) => (
  <Box
    sx={{
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mt: 24,
    }}
  >
    <IconButton sx={{ width: 144, height: 144 }} onClick={onClick}>
      <img alt="exchange icon" src={exchangeIcon} />
    </IconButton>
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px 8px',
        mt: 8,
        whiteSpace: 'nowrap',
        color: ({ palette }) => palette.grey[600],
      }}
    >
      <InfoRow
        label="Min Transfer"
        value={`${formatUnitAmount(
          feesAndLimits.minTransfer || 0,
          tokenDecimals || 18,
          2
        )} ${tokenName || ''}`}
        state={state}
      />
      <InfoRow
        label="Max Transfer"
        value={`${formatUnitAmount(feesAndLimits.maxTransfer || 0, 18, 2)} ${
          tokenName || ''
        }`}
        state={state}
      />
      <InfoRow
        label="Bridge Fee"
        value={`${formatUnitAmount(
          feesAndLimits.bridgeFee || 0,
          tokenDecimals || 18,
          2
        )} ${tokenName || ''}`}
        state={state}
      />
      <InfoRow
        label="Day Limit"
        value={`${formatUnitAmount(feesAndLimits.dailyLimit || 0, 18, 2)} ${
          tokenName || ''
        }`}
        state={state}
      />
    </Box>
  </Box>
);
