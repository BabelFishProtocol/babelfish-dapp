/* eslint-disable max-classes-per-file */
import { FlowState } from '../store/aggregator/aggregator.state';
import { ChainEnum } from './chains';
import { TokenEnum, tokenOnChain, tokens, TokenTypeBase } from './tokens';

export type TokenAllowed = TokenTypeBase & {
  originalDecimals?: number;
  originalAddress: string;
  rskSovrynDecimals?: number;
  rskSovrynAddress?: string;
};

class Bridge {
  constructor(
    public from: ChainEnum,
    public to: ChainEnum,
    public bridgeAddress: string,
    public rskBridgeAddress: string,
    public tokensAllowed: TokenAllowed[]
  ) {}

  public getTokenDecimals(token: TokenEnum, flowState: FlowState) {
    const tokenOnBridge = this.tokensAllowed?.find(
      (tokenAllowed) => tokenAllowed.id === token
    );
    if (flowState === 'deposit') {
      return tokenOnBridge?.originalDecimals || 18;
    }
    return tokenOnBridge?.rskSovrynDecimals || 18;
  }

  public getOriginalTokenAddress(token: TokenEnum) {
    const tokenOnBridge = this.tokensAllowed?.find(
      (tokenAllowed) => tokenAllowed.id === token
    );

    return tokenOnBridge?.originalAddress;
  }

  public getRskSovrynTokenAddress(token: TokenEnum) {
    const tokenOnBridge = this.tokensAllowed?.find(
      (tokenAllowed) => tokenAllowed.id === token
    );

    return tokenOnBridge?.rskSovrynAddress;
  }
}

export class BridgeDictionary {
  public static bridges: Bridge[] = [
    new Bridge(
      ChainEnum.BSC,
      ChainEnum.RSK,
      '0xdfc7127593c8af1a17146893f10e08528f4c2aa7',
      '0x971b97c8cc82e7d27bc467c2dc3f219c6ee2e350',
      [
        {
          ...tokens.DAI,
          originalAddress: tokenOnChain[TokenEnum.DAI][ChainEnum.BSC],
          rskSovrynAddress: '0x6A42Ff12215a90f50866A5cE43A9c9C870116e76',
        },
        {
          ...tokens.USDC,
          originalAddress: tokenOnChain[TokenEnum.USDC][ChainEnum.BSC],
          rskSovrynAddress: '0x91EDceE9567cd5612c9DEDeaAE24D5e574820af1',
        },
        {
          ...tokens.BUSD,
          originalAddress: tokenOnChain[TokenEnum.BUSD][ChainEnum.BSC],
          rskSovrynAddress: '0x61e9604e31a736129d7f5C58964c75935b2d80D6',
        },
        {
          ...tokens.USDT,
          originalAddress: tokenOnChain[TokenEnum.USDT][ChainEnum.BSC],
          rskSovrynAddress: '0xFf4299bCA0313C20A61dc5eD597739743BEf3f6d',
        },
      ]
    ),

    new Bridge(
      ChainEnum.ETH,
      ChainEnum.RSK,
      '0x33C0D33a0d4312562ad622F91d12B0AC47366EE1',
      '0x1ccad820b6d031b41c54f1f3da11c0d48b399581',
      [
        {
          ...tokens.DAI,
          originalAddress: tokenOnChain[TokenEnum.DAI][ChainEnum.ETH],
          rskSovrynAddress: '0x1A37c482465e78E6DAbE1Ec77B9a24D4236D2A11',
        },
        {
          ...tokens.USDT,
          originalDecimals: 6,
          originalAddress: tokenOnChain[TokenEnum.USDT][ChainEnum.ETH],
          rskSovrynAddress: '0xD9665EA8F5fF70Cf97E1b1Cd1B4Cd0317b0976e8',
        },
        {
          ...tokens.USDC,
          originalDecimals: 6,
          originalAddress: tokenOnChain[TokenEnum.USDC][ChainEnum.ETH],
          rskSovrynAddress: '0x8D1f7CbC6391D95E2774380e80A666FEbf655D6b',
        },
      ]
    ),

    new Bridge(
      ChainEnum.ETH_TESTNET,
      ChainEnum.RSK_TESTNET,
      '0x2b456e230225C4670FBF10b9dA506C019a24cAC7',
      '0xc0e7a7fff4aba5e7286d5d67dd016b719dcc9156',
      [
        {
          ...tokens.DAI,
          originalAddress: tokenOnChain[TokenEnum.DAI][ChainEnum.ETH_TESTNET],
          rskSovrynAddress: '0xcb92c8d49ec01b92f2a766c7c3c9c501c45271e0',
        },
        {
          ...tokens.USDT,
          originalDecimals: 6,
          originalAddress: tokenOnChain[TokenEnum.USDT][ChainEnum.ETH_TESTNET],
          rskSovrynAddress: '0x10c5a7930fc417e728574e334b1488b7895c4b81',
        },
        {
          ...tokens.USDC,
          originalDecimals: 6,
          originalAddress: tokenOnChain[TokenEnum.USDC][ChainEnum.ETH_TESTNET],
          rskSovrynAddress: '0xcc8eec21ae75f1a2de4ac7b32a7de888a45cf859',
        },
      ]
    ),
  ];

  public static get(from: ChainEnum, to: ChainEnum) {
    return this.bridges.find(
      (bridge) => bridge.from === from && bridge.to === to
    );
  }
  public static getAll(from: ChainEnum) {
    return this.bridges.find((bridge) => bridge.from === from);
  }
}
