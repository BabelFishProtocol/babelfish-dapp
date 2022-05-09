import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import closeIcon from '../../assets/icons/cross.svg';

export const BottomBanner = () => {
  const [bannerShow, setBannerShow] = useState(true);

  if (!bannerShow) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        px: 10,
        py: 2,
        textAlign: 'center',
        width: '100%',
        backgroundColor: ({ palette }) => palette.background.paper,
        color: 'black',
      }}
    >
      <Typography variant="body2">
        Alpha 0.1: Deposit/withdraw stablecoins from Ethereum and mint/burn
        meta-stablecoins on Rootstock. Visit our{' '}
        <Link
          target="_blank"
          href="https://discord.gg/5SEetbpq"
          color="primary"
        >
          Discord
        </Link>{' '}
        for more information.
        <br />
        WARNING: This is an early experiment and there is risk of loss of funds.
        DON&apos;T PANIC!.
      </Typography>

      <Box
        component="button"
        sx={{
          position: 'absolute',
          right: '30px',
          top: '30px',
          cursor: 'pointer',
          background: 'transparent',
          border: 'none',
        }}
        onClick={() => {
          setBannerShow(false);
        }}
      >
        <img height={15} width={15} src={closeIcon} alt="Close" />
      </Box>
    </Box>
  );
};
