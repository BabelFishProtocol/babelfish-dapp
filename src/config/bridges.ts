/* eslint-disable max-classes-per-file */
import { FlowState } from '../store/aggregator/aggregator.state';
import { ChainEnum } from './chains';
import { TokenEnum, tokens, TokenTypeBase } from './tokens';

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

// TODO: get tokens Addresses from tokenOnChain in BridgeDictionary to avoid repetitions

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
          originalAddress: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
          rskSovrynAddress: '0x6A42Ff12215a90f50866A5cE43A9c9C870116e76',
        },
        {
          ...tokens.USDC,
          originalAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
          rskSovrynAddress: '0x91EDceE9567cd5612c9DEDeaAE24D5e574820af1',
        },
        {
          ...tokens.BUSD,
          originalAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
          rskSovrynAddress: '0x61e9604e31a736129d7f5C58964c75935b2d80D6',
        },
        {
          ...tokens.USDT,
          originalAddress: '0x55d398326f99059ff775485246999027b3197955',
          rskSovrynAddress: '0xFf4299bCA0313C20A61dc5eD597739743BEf3f6d',
        },
      ]
    ),
    new Bridge(
      ChainEnum.BSC_TESTNET,
      ChainEnum.RSK_TESTNET,
      '0x862e8aff917319594cc7faaae5350d21196c086f',
      '0x2b2bcad081fa773dc655361d1bb30577caa556f8',
      [
        {
          ...tokens.DAI,
          originalAddress: '0x83241490517384cB28382Bdd4D1534eE54d9350F',
          rskSovrynAddress: '0x407ff7d4760D3a81B4740d268eb04490C7dfe7f2',
        },
        {
          ...tokens.USDC,
          originalAddress: '0x0b654C687dC8b828139406c070E0A34486e5072b',
          rskSovrynAddress: '0x3E2CF87e7fF4048A57f9cDdE9368c9F4BFB43ADF',
        },
        {
          ...tokens.BUSD,
          originalAddress: '0x137BEc8c83740920ebc4f29f51C7B65b75Beec83',
          rskSovrynAddress: '0x8C9abb6C9D8D15ddb7aDA2e50086E1050AB32688',
        },
        {
          ...tokens.USDT,
          originalAddress: '0x268e3bF855CbcDf8FE31bA3557a554aB2283351F',
          rskSovrynAddress: '0x43bC3F0FFFF6c9BBf3C2EAFE464c314d43f561De',
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
          originalAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          rskSovrynAddress: '0x1A37c482465e78E6DAbE1Ec77B9a24D4236D2A11',
        },
        {
          ...tokens.USDT,
          originalDecimals: 6,
          originalAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          rskSovrynAddress: '0xD9665EA8F5fF70Cf97E1b1Cd1B4Cd0317b0976e8',
        },
        {
          ...tokens.USDC,
          originalDecimals: 6,
          originalAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
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
          originalAddress: '0x974cf21396D4D29F8e63Ac07eCfcbaB51a739bc9',
          rskSovrynAddress: '0xcb92c8d49ec01b92f2a766c7c3c9c501c45271e0',
        },
        {
          ...tokens.USDT,
          originalDecimals: 6,
          originalAddress: '0xff364ffa4962cb172203a5be01d17cf3fef02419',
          rskSovrynAddress: '0x10c5a7930fc417e728574e334b1488b7895c4b81',
        },
        {
          ...tokens.USDC,
          originalDecimals: 6,
          originalAddress: '0x4C68058992b8aD1243eE23A5923023C0e15Cf43F',
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
