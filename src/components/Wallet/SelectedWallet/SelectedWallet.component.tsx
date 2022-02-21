import Box from '@mui/material/Box';

import { Button } from '../../Button/Button.component';
import { PrettyTx } from '../../PrettyTx/PrettyTx.component';
import { WalletIcon } from '../WalletIcon/WalletIcon.component';
import crossIcon from '../../../assets/icons/cross.svg';

import { SelectedWalletProps } from './SelectedWallet.types';

export const SelectedWallet = ({
  account,
  wallet,
  onDissconnect,
}: SelectedWalletProps) => (
  <Box
    sx={{
      display: 'flex',
      borderRadius: '8px',
      border: ({ palette }) => `2px solid ${palette.borderGrey.main}`,
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        padding: ({ spacing }) => spacing(1.2, 2),
        pr: 1,
        gap: 1,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <PrettyTx value={account.toUpperCase()} color="inherit" variant="body1" />
      <WalletIcon name={wallet.name} icon={wallet.icon} />
    </Box>
    <Button
      variant="text"
      onClick={onDissconnect}
      sx={{
        p: 1,
        minWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        backgroundColor: 'borderGrey.dark',
      }}
    >
      <img
        style={{
          width: '15px',
          height: '15px',
        }}
        src={crossIcon}
        alt="Close"
      />
    </Button>
  </Box>
);
