import { ChainEnum, chains, ChainType } from './chains';
import { tokens, TokenTypeBase } from './tokens';

export type BaseChainType = ChainType & {
  bassets: TokenTypeBase[];
};

const mainnetBaseChains: BaseChainType[] = [
  {
    ...chains[ChainEnum.ETH],
    bassets: [tokens.USDT, tokens.USDC, tokens.DAI],
  },
  {
    ...chains[ChainEnum.BSC],
    bassets: [tokens.USDT, tokens.USDC, tokens.BUSD, tokens.DAI],
  },
];
export const mainnetPool = {
  baseChains: mainnetBaseChains,
  masset: tokens.XUSD,
  masterChain: chains[ChainEnum.RSK],
};

const testnetBaseChains: BaseChainType[] = [
  {
    ...chains[ChainEnum.ETH_TESTNET],
    bassets: [tokens.USDT, tokens.USDC, tokens.DAI],
  },
  {
    ...chains[ChainEnum.BSC_TESTNET],
    bassets: [tokens.USDT, tokens.USDC, tokens.BUSD, tokens.DAI],
  },
];
export const testnetPool = {
  baseChains: testnetBaseChains,
  masset: tokens.XUSD,
  masterChain: chains[ChainEnum.RSK_TESTNET],
};
