import { ChainEnum } from '../../config/chains';

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { WalletConnectionCheckerProps } from './WalletConnectionChecker.types';

export const WalletConnectionChecker = ({
  expectedChainName = 'RSK',
  expectedChains = [ChainEnum.RSK, ChainEnum.RSK_TESTNET],
  children,
}: WalletConnectionCheckerProps) => {
  const web3Data = useActiveWeb3React();

  return (
    <>
      <AppDialog
        isOpenDialog={!web3Data.active}
        title="Connect wallet"
        dialogPaperProps={{ sx: { minHeight: 0 } }}
      >
        Please connect your wallet to the {expectedChainName} Network
      </AppDialog>

      <AppDialog
        isOpenDialog={
          web3Data.active && !expectedChains.includes(web3Data.chainId)
        }
        title="Wrong network"
      >
        Wrong network. Please your wallet to the {expectedChainName} Network
      </AppDialog>

      {children}
    </>
  );
};
