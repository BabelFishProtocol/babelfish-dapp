import { ChainEnum, chains, ChainType } from './chains';
import { tokens, TokenTypeBase } from './tokens';

export type BaseChainType = ChainType & {
  bassets: TokenTypeBase[];
};

const mainnetBaseChains: BaseChainType[] = [
  {
    ...chains[ChainEnum.ETH],
    bassets: [tokens.USDT, tokens.USDC, tokens.DAI, tokens.USDP],
  },
  {
    ...chains[ChainEnum.BSC],
    bassets: [tokens.USDT, tokens.USDC, tokens.BUSD, tokens.DAI, tokens.USDP],
  },
];
export const mainnetPool = {
  baseChains: mainnetBaseChains,
  masset: tokens.XUSD,
  masterChain: chains.RSK,
};
