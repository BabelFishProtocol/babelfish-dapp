import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import exchangeIcon from '../../../assets/icons/exchange.svg';
import { InfoRow } from './InfoRow.component';

const mockInfo = [
  { label: 'Min Transfer', value: '0.0100 ETH' },
  { label: 'Max Transfer', value: '10,000,000.0000 ETH' },
  { label: 'Bridge Fee', value: '0.0010 ETH' },
  { label: 'Day Limit', value: '100,000,000.0000 ETH' },
];

export const AgregatorInfo = ({ onClick }: { onClick: () => void }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      mb: 14,
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
      {mockInfo.map(({ label, value }) => (
        <InfoRow key={label} label={label} value={value} />
      ))}
    </Box>
  </Box>
);
