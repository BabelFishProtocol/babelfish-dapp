import { BigNumberish, utils } from 'ethers';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';

import { Web3Provider } from '@ethersproject/providers';
import { CellParser } from '../components/DataTable/DataTable.types';
import { calldataRegex, signatureRegex } from '../constants';
import { ChainEnum, chains } from '../config/chains';
import { isErrorWithCode } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

export const pick = <Obj extends {}, Keys extends keyof Obj>(
  object: Obj,
  keys: ReadonlyArray<Keys>
): Pick<Obj, Keys> =>
  keys.reduce((obj, key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {} as Obj);

export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ... ${end}`;
};

export const isRskAddress = (address: string) =>
  utils.isAddress(address ? address.toLowerCase() : '');

export const getCurrentTimestamp = () => dayjs().unix();

export const timestampToDate = (timestamp: number) =>
  new Date(timestamp * 1000);

export const formatDateUTC = (date: Date) =>
  dayjs.tz(date, 'GMT').format('DD/MM/YYYY - h:mm:ss a z');

export const formatDate = (date: Date) =>
  dayjs(date).format('MMMM D, YYYY h:mm a');

export const formatTimestamp = (timestamp?: number | string) =>
  timestamp ? formatDate(timestampToDate(Number(timestamp))) : '';

export const formatTimestampToUTC: CellParser = (timestamp) =>
  timestamp ? formatDateUTC(timestampToDate(Number(timestamp))) : '';

export const isTimeStampLocked = (timestamp: number | string): boolean => {
  const parsedDate = timestampToDate(Number(timestamp));

  return dayjs().isAfter(parsedDate);
};

export const getFutureTimestamp = (
  startTime: number,
  startBlock: number,
  endBlock: number,
  blockTime: number
) => startTime + (endBlock - startBlock) * blockTime;

const truncate = (str: string, digits = 4) => {
  if (str.includes('.')) {
    const [integer, decimals] = str.split('.');

    const addZeros = (val: string) =>
      `${decimals}${Array.from({ length: digits - val.length })
        .map(() => '0')
        .join('')}`;

    const decimalPart =
      decimals.length >= digits
        ? decimals.slice(0, digits)
        : addZeros(decimals);

    return `${integer}.${decimalPart}`;
  }

  return str;
};

export const isValidSignature = (val: string) => val.match(signatureRegex);

export const isValidCalldata = (val: string) => val.match(calldataRegex);

export const formatWeiAmount = (weiAmount: BigNumberish, decimalDigits = 4) =>
  truncate(utils.commify(utils.formatEther(weiAmount)), decimalDigits);

export const formatUnitAmount = (
  weiAmount: BigNumberish,
  tokenDecimals: number,
  decimalDigits = 4
) =>
  truncate(
    utils.commify(utils.formatUnits(weiAmount, tokenDecimals)),
    decimalDigits
  );

export const formatBlockNumber = (val: string | number) => `#${val}`;

export const truncateString = (text: string, maxLength = 25) =>
  text.length > maxLength ? `${text.substring(0, maxLength)} ...` : text;

export const compareAddresses = (addr1: string, addr2: string) =>
  addr1.toLowerCase() === addr2.toLowerCase();

export const switchConnectedChain = async (
  provider: Web3Provider,
  startingChain: ChainEnum
) => {
  try {
    await provider.send('wallet_switchEthereumChain', [
      { chainId: `0x${startingChain.toString(16)}` },
    ]);
  } catch (switchError) {
    if (isErrorWithCode(switchError) && switchError.code === 4902) {
      try {
        const chain = chains[startingChain];

        await provider.send('wallet_addEthereumChain', [
          {
            chainId: `0x${startingChain.toString(16)}`,
            chainName: chain.name,
            rpcUrls: chain.rpcUrls,
          },
        ]);
        await provider.send('wallet_switchEthereumChain', [
          { chainId: `0x${startingChain.toString(16)}` },
        ]);
        return;
      } catch (addError) {
        return addError;
      }
    }
    return switchError;
  }
};
