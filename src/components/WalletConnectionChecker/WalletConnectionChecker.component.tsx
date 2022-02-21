import Typography from '@mui/material/Typography';

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { WalletConnectionCheckerProps } from './WalletConnectionChecker.types';

export const WalletConnectionChecker = ({
  expectedChainName = 'RSK',
  expectedChains = [30, 31],
  children,
}: WalletConnectionCheckerProps) => {
  const web3Data = useActiveWeb3React();

  if (!web3Data.active) {
    return (
      <Typography color="primary" sx={{ wdith: '100%', textAlign: 'center' }}>
        Please connect your wallet to the {expectedChainName} Network
      </Typography>
    );
  }

  if (!expectedChains.includes(web3Data.chainId)) {
    return (
      <Typography color="primary" sx={{ wdith: '100%', textAlign: 'center' }}>
        Wrong network. Please your wallet to the {expectedChainName} Network
      </Typography>
    );
  }

  return children;
};
