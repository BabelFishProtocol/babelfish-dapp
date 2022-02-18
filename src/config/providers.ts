// import Portis from '@portis/web3';
import { InjectedConnector } from '@web3-react/injected-connector';

export const injectedProvider = new InjectedConnector({
  supportedChainIds: [
    // temporary
    30, 31,
  ],
});

// const portis = new Portis('d5bd0255-e892-439b-b43c-92b83dfe2be1', 'mainnet');

// export const portisProvider = portis.provider;
