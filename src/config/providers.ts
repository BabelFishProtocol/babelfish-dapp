import { InjectedConnector } from '@web3-react/injected-connector';
// import { PortisConnector } from '@web3-react/portis-connector';
import { ChainEnum } from './chains';

// TODO: set supported networks dynamically
const SUPPORTED_CHAINS = Object.values(ChainEnum).filter(
  (item) => typeof item === 'number'
);

export const injectedConnector = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAINS as ChainEnum[],
});

// export const portisConnector = new PortisConnector({
//   dAppId: 'd5bd0255-e892-439b-b43c-92b83dfe2be1',
//   networks: SUPPORTED_CHAINS as ChainEnum[],
// });
