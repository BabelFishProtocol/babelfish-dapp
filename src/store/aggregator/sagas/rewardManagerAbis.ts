export const getRewardForDepositAbi = {
  name: 'getRewardForDeposit',
  payable: false,
  stateMutability: 'view',
  type: 'function',
  constant: true,
  inputs: [
    {
      internalType: 'address',
      name: '_bassetAddress',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: '_sum',
      type: 'uint256',
    },
    {
      internalType: 'bool',
      name: '_bridgeMode',
      type: 'bool',
    },
  ],
  outputs: [
    {
      internalType: 'uint256',
      name: '',
      type: 'uint256',
    },
  ],
};

export const getPenaltyForWithdrawalAbi = {
  name: 'getPenaltyForWithdrawal',
  constant: true,
  payable: false,
  stateMutability: 'view',
  type: 'function',
  inputs: [
    {
      internalType: 'address',
      name: '_bassetAddress',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: '_sum',
      type: 'uint256',
    },
  ],
  outputs: [
    {
      internalType: 'uint256',
      name: '',
      type: 'uint256',
    },
  ],
};
