import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import exchangeIcon from '../../../assets/icons/exchange.svg';
import { DEFAULT_ASSET_DECIMALS } from '../../../constants';
import { IncentiveType } from '../../../store/aggregator/aggregator.state';
import { formatUnitAmount } from '../../../utils/helpers';
import { SendAmount } from '../SendAmount/SendAmount.container';
import { AggregatorInfoComponentProps } from './AggregatorInfo.types';
import { InfoRow } from './InfoRow.component';
import { InfoRowWithPerc } from './InfoRowWithPerc.component';

export const AggregatorInfoComponent = ({
  onClick,
  feesAndLimitsState,
  feesAndLimits,
  startingToken,
  destinationToken,
  tokenDecimals,
  aggregatorBalance,
  aggregatorBalanceState,
  incentivesState,
  incentives,
  sendAmount
}: AggregatorInfoComponentProps) => (
  <Box
    sx={{
      alignSelf: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mt: 24,
      minWidth: 230,
    }}
  >
    <IconButton
      sx={{
        width: 144,
        height: 144,
        background: ({ palette }) => palette.grey[800],
      }}
      onClick={onClick}
    >
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
      <InfoRowWithPerc
        label={incentives?.type === IncentiveType.penalty ? 'Penalty' : 'Reward'}
        value={`${incentives?.amount || '0.0'}`}
        total={`${sendAmount || '0.0'}`}
        unit="XUSD"
        state={incentivesState}
      />
    </Box>
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
      {aggregatorBalance && (
        <InfoRow
          label="Aggregator Balance"
          value={`${formatUnitAmount(
            aggregatorBalance,
            DEFAULT_ASSET_DECIMALS,
            2
          )} ${destinationToken || ''}`}
          state={aggregatorBalanceState}
        />
      )}

      {feesAndLimitsState === 'success' && (
        <>
          <InfoRow
            label="Min Transfer"
            value={`${formatUnitAmount(
              feesAndLimits.minTransfer || 0,
              tokenDecimals || DEFAULT_ASSET_DECIMALS,
              2
            )} ${startingToken || ''}`}
            state={feesAndLimitsState}
          />
          <InfoRow
            label="Max Transfer"
            value={`${formatUnitAmount(
              feesAndLimits.maxTransfer || 0,
              DEFAULT_ASSET_DECIMALS,
              2
            )} ${startingToken || ''}`}
            state={feesAndLimitsState}
          />
          <InfoRow
            label="Bridge Fee"
            value={`${formatUnitAmount(
              feesAndLimits.bridgeFee || 0,
              tokenDecimals || DEFAULT_ASSET_DECIMALS,
              2
            )} ${startingToken || ''}`}
            state={feesAndLimitsState}
          />
          <InfoRow
            label="Day Limit"
            value={`${formatUnitAmount(
              feesAndLimits.dailyLimit || 0,
              DEFAULT_ASSET_DECIMALS,
              2
            )} ${startingToken || ''}`}
            state={feesAndLimitsState}
          />
        </>
      )}
    </Box>
  </Box>
);
