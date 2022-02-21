// import Portis from '@portis/web3';
import { InjectedConnector } from '@web3-react/injected-connector';

// TODO: replace with ChainEnum when it's ready
const SUPPORTED_CHAINS = [30, 31];

export const injectedProvider = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAINS,
});

// const portis = new Portis('d5bd0255-e892-439b-b43c-92b83dfe2be1', 'mainnet');

// export const portisProvider = portis.provider;
