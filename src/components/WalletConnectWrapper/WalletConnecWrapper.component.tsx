import Typography from '@mui/material/Typography';

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { WalletConnectInfoProps } from './WalletConnectWrapper.types';

export const WalletConnectWrapper = ({
  expectedChainName = 'RSK',
  expectedChains = [30, 31],
  children,
}: WalletConnectInfoProps) => {
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
