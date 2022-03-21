import { BigNumberish, utils } from 'ethers';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';

import { CellParser } from '../components/DataTable/DataTable.types';
import { calldataRegex, signatureRegex } from '../constants';

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
