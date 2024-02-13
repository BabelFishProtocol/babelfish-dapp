import { ChainEnum, chains, ChainType } from './chains';
import { tokens, TokenTypeBase } from './tokens';

export type BaseChainType = ChainType & {
  bassets: TokenTypeBase[];
};

export enum PoolEnum {
  mainnet = 'mainnet',
  testnet = 'testnet',
}

// TODO: Should be changeable by user
export const DEFAULT_POOL = PoolEnum.mainnet;

const mainnetBaseChains: BaseChainType[] = [
  {
    ...chains[ChainEnum.RSK],
    bassets: [tokens.DOC, tokens.RDOC, tokens.RUSDT, tokens.ZUSD],
  },
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
    ...chains[ChainEnum.RSK_TESTNET],
    bassets: [
      tokens.DOC,
      tokens.RDOC,
      tokens.RUSDT,
      tokens.ZUSD,
      tokens.DLLR,
      tokens.TST1,
      tokens.TST2,
      tokens.TST3,
      tokens.TST4,
      tokens.TST6,
    ],
  },
  {
    ...chains[ChainEnum.ETH_TESTNET],
    bassets: [tokens.SEPUSD],
  },
];
export const testnetPool = {
  baseChains: testnetBaseChains,
  masset: tokens.XUSD,
  masterChain: chains[ChainEnum.RSK_TESTNET],
};

type PoolType = {
  baseChains: BaseChainType[];
  masset: TokenTypeBase;
  masterChain: ChainType;
};

type PoolsType = {
  [pool in PoolEnum]: PoolType;
};

export const poolHasChain = ({
  pool,
  chain,
}: {
  pool: PoolType;
  chain: ChainEnum;
}): boolean =>
  !!(
    pool.baseChains.find((baseChain) => baseChain.id === chain) ||
    pool.masterChain.id === chain
  );

export const pools: PoolsType = {
  [PoolEnum.mainnet]: mainnetPool,
  [PoolEnum.testnet]: testnetPool,
};
