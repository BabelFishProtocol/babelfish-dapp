import Onboard from '@sovryn/onboard-core';
import { Asset, BasePath } from '@sovryn/onboard-hw-common';
import injectedModule from '@sovryn/onboard-injected';
import ledgerModule from '@sovryn/onboard-ledger';
import trezorModule from '@sovryn/onboard-trezor';
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
  email: 'victor@sovryn.app',
  appUrl: 'http://localhost:3000/',
  basePaths,
  assets,
});

export const onboard = Onboard({
  wallets: [injected, ledger, trezor],
  chains: chains.map((item) => ({
    ...item,
    rpcUrl: typeof item.rpcUrl === 'string' ? item.rpcUrl : item.rpcUrl[0],
  })),
});
