import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import exchangeIcon from '../../../assets/icons/exchange.svg';
import { DEFAULT_ASSET_DECIMALS } from '../../../constants';
import { IncentiveType } from '../../../store/aggregator/aggregator.state';
import { formatUnitAmount } from '../../../utils/helpers';
import { AggregatorInfoComponentProps } from './AggregatorInfo.types';
import { InfoRow } from './InfoRow.component';
import { InfoRowWithPerc } from './InfoRowWithPerc.component';
import { Typography } from '@mui/material';
import { Heading } from '@sovryn/ui';
import { AggregatorInfoErrorComponent } from './AggregatorInfoError.component';

interface AggregatorInfoSwitchComponentProps {
    onClick: () => void;
}

export const AggregatorInfoSwitchComponent = ({
    onClick
}: AggregatorInfoSwitchComponentProps) => (
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
);
