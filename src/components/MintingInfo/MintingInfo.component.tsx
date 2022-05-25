import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PrettyTx } from '../PrettyTx/PrettyTx.component';
import { MintingInfoPros } from './MintingInfo.types';

export const MintingInfo = ({ data }: MintingInfoPros) => (
  <>
    {data.map(({ label, value, isProminent, formatTx }, index) => (
      <Box
        key={index}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
          my: '5px',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'right',
          }}
        >
          {label}:
        </Typography>
        <Typography
          sx={({ palette }) => ({
            textAlign: 'left',
            color: isProminent ? palette.primary.main : 'white',
          })}
          variant="body1"
        >
          {formatTx ? (
            <PrettyTx value={value as string} variant="body1" />
          ) : (
            value
          )}
        </Typography>
      </Box>
    ))}
  </>
);
