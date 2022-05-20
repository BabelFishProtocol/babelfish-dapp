import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { formatWeiAmount } from '../../utils/helpers';

import {
  BalanceBlockProps,
  BalanceBlockValueProps,
  BalanceBlockContentProps,
} from './BalanceBlock.types';
import { WaveImage } from '../../pages/Staking/WaveImage/WaveImage.component';

export const BalanceBlock = ({
  sx,
  label,
  data,
  state,
  children,
  typographySx,
  index,
  aprox = false,
  asset = 'FISH',
  centered = false,
}: BalanceBlockProps) => {
  const isUpdate = state === 'loading' && !!data;

  return (
    <Container
      sx={{
        position: 'relative',
        padding: index ? '2rem 2rem 4rem' : 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'initial',
        '& *': { zIndex: 1 },
        ...sx,
      }}
    >
      <Typography variant="h4" component="div" sx={{ position: 'relative' }}>
        {label}
        {isUpdate && (
          <CircularProgress
            size={16}
            color="primary"
            sx={{ position: 'absolute', right: '-24px', ml: 1 }}
          />
        )}
      </Typography>

      <BalanceBlockContent
        data={data}
        state={state}
        asset={asset}
        aprox={aprox}
        typographySx={{
          textAlign: centered ? 'center' : 'inherit',
          ...typographySx,
        }}
      />
      {(state === 'success' || isUpdate) && children && (
        <Box sx={{ mt: 2 }}>{children}</Box>
      )}

      {!!index && <WaveImage index={index} />}
    </Container>
  );
};

export const BalanceBlockContent = ({
  data,
  state,
  asset,
  aprox,
  typographySx,
  variant = 'h5',
}: BalanceBlockContentProps) => (
  <Typography
    variant={variant}
    sx={{ mt: 1, width: 'inherit', ...typographySx }}
    color={state === 'failure' ? 'error' : 'inherit'}
  >
    <BalanceBlockValue data={data} state={state} aprox={aprox} asset={asset} />
  </Typography>
);

const BalanceBlockValue = ({
  data,
  state,
  asset,
  aprox,
}: BalanceBlockValueProps) => {
  if (state === 'loading' && !data) {
    return <Skeleton data-testid="balanceBlock-skeleton" />;
  }

  if (state === 'failure') {
    return <>Unable to load data!</>;
  }

  return (
    <>
      {aprox && '≈ '}
      {formatWeiAmount(data ?? 0)} {asset}
    </>
  );
};
