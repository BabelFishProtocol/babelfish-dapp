// import Portis from '@portis/web3';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ChainEnum } from './chains';

const SUPPORTED_CHAINS = Object.values(ChainEnum).filter(
  (item) => typeof item === 'number'
);

export const injectedProvider = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAINS as ChainEnum[],
});

// const portis = new Portis('d5bd0255-e892-439b-b43c-92b83dfe2be1', 'mainnet');

// export const portisProvider = portis.provider;
