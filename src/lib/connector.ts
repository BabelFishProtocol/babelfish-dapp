import Onboard from '@sovryn/onboard-core';
import { Asset, BasePath } from '@sovryn/onboard-hw-common';
import injectedModule from '@sovryn/onboard-injected';
import ledgerModule from '@sovryn/onboard-ledger';
import trezorModule from '@sovryn/onboard-trezor';
import walletConnectModule from '@sovryn/onboard-walletconnect';
import { chains } from '../config/sovryn-onboard-chains';

const basePaths: BasePath[] = [
  { label: 'RSK Mainnet', value: "m/44'/137'/0'/0" },
  { label: 'Ethereum Mainnet', value: "m/44'/60'/0'/0" },
];
const assets: Asset[] = [{ label: 'RBTC' }, { label: 'ETH' }];

const injected = injectedModule();
const ledger = ledgerModule({
  basePaths,
  assets,
});
const trezor = trezorModule({
  email: 'tiltom.defi@proton.me',
  appUrl: 'https://app.babelfish.money/',
  basePaths,
  assets,
});

const walletConnect = walletConnectModule();

export const onboard = Onboard({
  wallets: [injected, walletConnect, ledger, trezor],
  chains: chains.map((item) => ({
    ...item,
    rpcUrl: typeof item.rpcUrl === 'string' ? item.rpcUrl : item.rpcUrl[0],
  })),
});
