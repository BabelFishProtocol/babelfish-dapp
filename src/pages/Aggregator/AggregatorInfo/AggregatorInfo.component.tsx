import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import exchangeIcon from '../../../assets/icons/exchange.svg';
import { FeesAndLimitsType } from '../../../store/aggregator/aggregator.state';
import { FiniteStates } from '../../../utils/types';
import { InfoRow } from './InfoRow.component';

export const AggregatorInfoComponent = ({
  onClick,
  state,
  feesAndLimits,
}: {
  onClick: () => void;
  state: FiniteStates;
  feesAndLimits: FeesAndLimitsType;
}) => (
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
      <img alt="exchange icon" width={40} src={exchangeIcon} />
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
        value={feesAndLimits.minTransfer}
        state={state}
      />
      <InfoRow
        label="Max Transfer"
        value={feesAndLimits.maxTransfer}
        state={state}
      />
      <InfoRow
        label="Bridge Fee"
        value={feesAndLimits.bridgeFee}
        state={state}
      />
      <InfoRow
        label="Day Limit"
        value={feesAndLimits.dailyLimit}
        state={state}
      />
    </Box>
  </Box>
);
