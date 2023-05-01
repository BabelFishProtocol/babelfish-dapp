import axios from "axios";
import { ChainEnum } from "../config/chains";
import { contractsAddresses } from "../config/contracts";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { BigNumber } from "ethers";

const publicTestnetNodeUrl = 'https://public-node.testnet.rsk.co';
const publicMainnetBodeUrl = 'https://public-node.rsk.co';

const getRewardForDepositAbi = {
    "name": "getRewardForDeposit",
    "payable": false,
    "stateMutability": 'view',
    "type": "function",
    "constant": true,
    "inputs": [
        {
            "internalType": "address",
            "name": "_bassetAddress",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "_sum",
            "type": "uint256"
        },
        {
            "internalType": "bool",
            "name": "_bridgeMode",
            "type": "bool"
        }
    ],
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ]
};

const getPenaltyForWithdrawalAbi = {
    "name": "getPenaltyForWithdrawal",
    "constant": true,
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "inputs": [
        {
            "internalType": "address",
            "name": "_bassetAddress",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "_sum",
            "type": "uint256"
        }
    ],
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ]
};

export function* getReward(tokenAddress: string, sum: BigNumber, mainnetFlag: boolean) {

    const url = mainnetFlag ? publicMainnetBodeUrl : publicTestnetNodeUrl;
    const rewardManagerAddress =
        contractsAddresses[mainnetFlag ? ChainEnum.RSK : ChainEnum.RSK_TESTNET].rewardManager;
    const bridgeMode = false;
    const web3 = new Web3();
    const data = web3.eth.abi
        .encodeFunctionCall(getRewardForDepositAbi as AbiItem,
            [tokenAddress.toLocaleLowerCase(), sum, bridgeMode] as any[]);

    console.log('data: ', data);

    axios.post(url, {
        jsonrpc: '2.0',
        id: + new Date(),
        method: 'eth_call',
        params: [{
            to: rewardManagerAddress,
            data
        }, 'latest'],
    }, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            console.log('!!! ??? ', response);
            return BigNumber.from(response.data?.result);
        })

    return BigNumber.from('0');
}

export function* getPenalty(tokenAddress: string, sum: BigNumber, mainnetFlag: boolean) {

    const url = mainnetFlag ? publicMainnetBodeUrl : publicTestnetNodeUrl;
    const rewardManagerAddress =
        contractsAddresses[mainnetFlag ? ChainEnum.RSK : ChainEnum.RSK_TESTNET].rewardManager;
    const bridgeMode = false;
    const web3 = new Web3();
    const data = web3.eth.abi
        .encodeFunctionCall(getPenaltyForWithdrawalAbi as AbiItem,
            [tokenAddress.toLocaleLowerCase(), sum, bridgeMode] as any[]);

    console.log('data: ', data);

    axios.post(url, {
        jsonrpc: '2.0',
        id: + new Date(),
        method: 'eth_call',
        params: [{
            to: rewardManagerAddress,
            data
        }, 'latest'],
    }, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            console.log('!!! ??? ', response);
            return BigNumber.from(response.data?.result);
        })

    return BigNumber.from('0');
}
