import { Request, newHttpClient } from 'typescript-http-client';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { BigNumber } from 'ethers';
import {
  getPenaltyForWithdrawalAbi,
  getRewardForDepositAbi,
} from './sagas/rewardManagerAbis';
import { ChainEnum } from '../../config/chains';
import { contractsAddresses } from '../../config/contracts';

const publicTestnetNodeUrl = 'https://public-node.testnet.rsk.co';
const publicMainnetBodeUrl = 'https://public-node.rsk.co';

const web3 = new Web3();
const client = newHttpClient();

interface JsonRpcResponse {
  result: string;
}

interface JsonRpcRequest {}

async function jsonRpcPost(
  mainnetFlag: boolean,
  data: JsonRpcRequest
): Promise<JsonRpcResponse> {
  const url = mainnetFlag ? publicMainnetBodeUrl : publicTestnetNodeUrl;
  const rewardManagerAddress =
    contractsAddresses[mainnetFlag ? ChainEnum.RSK : ChainEnum.RSK_TESTNET]
      .rewardManager;
  const request = new Request(url, {
    method: 'POST',
    responseType: 'json',
    body: {
      jsonrpc: '2.0',
      id: `${new Date()}`,
      method: 'eth_call',
      params: [
        {
          to: rewardManagerAddress,
          data,
        },
        'latest',
      ],
    },
  });
  const responseBody = await client.execute<JsonRpcResponse>(request);
  return responseBody;
}

export async function getReward(
  tokenAddress: string,
  sum: BigNumber,
  mainnetFlag: boolean
) {
  const bridgeMode = false;
  const data = web3.eth.abi.encodeFunctionCall(
    getRewardForDepositAbi as AbiItem,
    [
      tokenAddress.toLocaleLowerCase(),
      sum,
      bridgeMode
    ] as string[]
  );
  const response = await jsonRpcPost(mainnetFlag, data);
  return BigNumber.from(response.result);
}

export async function getPenalty(
  tokenAddress: string,
  sum: BigNumber,
  mainnetFlag: boolean
) {
  const bridgeMode = false;
  const data = web3.eth.abi.encodeFunctionCall(
    getPenaltyForWithdrawalAbi as AbiItem,
    [
      tokenAddress.toLocaleLowerCase(),
      sum,
      bridgeMode
    ] as string[]
  );
  const response = await jsonRpcPost(mainnetFlag, data);
  return BigNumber.from(response.result);
}
