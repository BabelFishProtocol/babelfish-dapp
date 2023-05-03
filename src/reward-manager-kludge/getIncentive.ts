import axios from "axios";
import { ChainEnum } from "../config/chains";
import { contractsAddresses } from "../config/contracts";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { BigNumber } from "ethers";
import { getPenaltyForWithdrawalAbi, getRewardForDepositAbi } from "./rewardManagerAbis";

const publicTestnetNodeUrl = 'https://public-node.testnet.rsk.co';
const publicMainnetBodeUrl = 'https://public-node.rsk.co';

export async function getReward(tokenAddress: string, sum: BigNumber, mainnetFlag: boolean) {

    const url = mainnetFlag ? publicMainnetBodeUrl : publicTestnetNodeUrl;
    const rewardManagerAddress =
        contractsAddresses[mainnetFlag ? ChainEnum.RSK : ChainEnum.RSK_TESTNET].rewardManager;
    const bridgeMode = false;
    const web3 = new Web3();
    const data = web3.eth.abi
        .encodeFunctionCall(getRewardForDepositAbi as AbiItem,
            [tokenAddress.toLocaleLowerCase(), sum, bridgeMode] as any[]);

    return axios.post(url, {
        jsonrpc: '2.0',
        id: + new Date(),
        method: 'eth_call',
        params: [{
            to: rewardManagerAddress,
            data
        }, 'latest']
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => BigNumber.from(response.data?.result));
}

export async function getPenalty(tokenAddress: string, sum: BigNumber, mainnetFlag: boolean) {

    const url = mainnetFlag ? publicMainnetBodeUrl : publicTestnetNodeUrl;
    const rewardManagerAddress =
        contractsAddresses[mainnetFlag ? ChainEnum.RSK : ChainEnum.RSK_TESTNET].rewardManager;
    const bridgeMode = false;
    const web3 = new Web3();
    const data = web3.eth.abi
        .encodeFunctionCall(getPenaltyForWithdrawalAbi as AbiItem,
            [tokenAddress.toLocaleLowerCase(), sum, bridgeMode] as any[]);

    return axios.post(url, {
        jsonrpc: '2.0',
        id: + new Date(),
        method: 'eth_call',
        params: [{
            to: rewardManagerAddress,
            data
        }, 'latest']
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => BigNumber.from(response.data?.result));
}
