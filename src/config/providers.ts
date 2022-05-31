import { InjectedConnector } from '@web3-react/injected-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import { SUPPORTED_PORTIS_CHAINS } from './chains';

export const injectedConnector = new InjectedConnector({});

export const portisConnector = new PortisConnector({
  dAppId: 'd5bd0255-e892-439b-b43c-92b83dfe2be1',
  // dAppId: 'bcc11290-a380-4a00-96b2-ca2803da406e',
  networks: SUPPORTED_PORTIS_CHAINS,
});
// export const ledgerConnector = new LedgerConnector({
//   // dAppId: 'd5bd0255-e892-439b-b43c-92b83dfe2be1',
//   chainId: 31,
//   url: 'http://localhost:3000',
// });
