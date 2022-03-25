import { ChainEnum } from './chains';
import { tokens, TokenTypeBase } from './tokens';

export type TokenAllowed = TokenTypeBase & {
  originalAddress: string;
  rskSovrynAddress?: string;
};

type Bridge = {
  from: ChainEnum;
  to: ChainEnum;
  bridgeAddress: string;
  rskBridgeAddress?: string; // TODO: should be required
  tokensAllowed?: TokenAllowed[]; // TODO: should be required
};

export class BridgeDictionary {
  public static bridges: Bridge[] = [
    {
      from: ChainEnum.BSC,
      to: ChainEnum.RSK,
      bridgeAddress: '0xdfc7127593c8af1a17146893f10e08528f4c2aa7',
      tokensAllowed: [
        {
          ...tokens.DAI,
          originalAddress: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
          rskSovrynAddress: '',
        },
        {
          ...tokens.USDC,
          originalAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
          rskSovrynAddress: '',
        },
        {
          ...tokens.BUSD,
          originalAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
          rskSovrynAddress: '',
        },
        {
          ...tokens.USDT,
          originalAddress: '0x55d398326f99059ff775485246999027b3197955',
          rskSovrynAddress: '',
        },
      ],
    },
    {
      from: ChainEnum.BSC_TESTNET,
      to: ChainEnum.RSK_TESTNET,
      bridgeAddress: '0x862e8aff917319594cc7faaae5350d21196c086f',
      // allowTokensAddress: '0xeb23e848ceca88b7d0c019c7186bb86cefadd0bd',
      tokensAllowed: [
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
      ],
    },

    {
      from: ChainEnum.ETH,
      to: ChainEnum.RSK,
      bridgeAddress: '0x33C0D33a0d4312562ad622F91d12B0AC47366EE1',
      rskBridgeAddress: '0x1ccad820b6d031b41c54f1f3da11c0d48b399581',
      tokensAllowed: [
        {
          ...tokens.DAI,
          originalAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          rskSovrynAddress: '0x1A37c482465e78E6DAbE1Ec77B9a24D4236D2A11',
        },
        {
          ...tokens.USDT,
          originalAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          rskSovrynAddress: '0xD9665EA8F5fF70Cf97E1b1Cd1B4Cd0317b0976e8',
        },
        {
          ...tokens.USDC,
          originalAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          rskSovrynAddress: '0x8D1f7CbC6391D95E2774380e80A666FEbf655D6b',
        },
      ],
    },

    {
      from: ChainEnum.ETH_TESTNET,
      to: ChainEnum.RSK_TESTNET,
      bridgeAddress: '0x2b456e230225C4670FBF10b9dA506C019a24cAC7',
    },
    // {
    //   from: ChainEnum.RSK_TESTNET,
    //   to: ChainEnum.BSC_TESTNET,
    //   bridgeAddress: '0x2b2bcad081fa773dc655361d1bb30577caa556f8',
    // },

    // {
    //   from: ChainEnum.RSK,
    //   to: ChainEnum.BSC,
    //   address: '0x971b97c8cc82e7d27bc467c2dc3f219c6ee2e350',
    // },
    // {
    //   from: ChainEnum.RSK,
    //   to: ChainEnum.ETH,
    //   address: '0x1CcAd820B6d031B41C54f1F3dA11c0d48b399581',
    // },
    // {
    //   from: ChainEnum.RSK_TESTNET,
    //   to: ChainEnum.ETH_TESTNET,
    //   address: '0xC0E7A7FfF4aBa5e7286D5d67dD016B719DCc9156',
    // },
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
