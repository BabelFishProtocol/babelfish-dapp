import { BigNumberish, utils } from 'ethers';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';

import { CellParser } from '../components/DataTable/DataTable.types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ... ${end}`;
};

export const isRskAddress = (address: string) => utils.isAddress(address || '');

export const timestampToDate = (timestamp: number) =>
  new Date(timestamp * 1000);

export const formatDateUTC = (date: Date) =>
  dayjs.tz(date, 'GMT').format('DD/MM/YYYY - h:mm:ss a z');

export const formatDate = (date: Date) => dayjs(date).format('DD.MM.YYYY');

export const formatTimestamp: CellParser = (timestamp) =>
  timestamp ? formatDate(timestampToDate(Number(timestamp))) : '';

export const formatTimestampToUTC: CellParser = (timestamp) =>
  timestamp ? formatDateUTC(timestampToDate(Number(timestamp))) : '';

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

export const formatWeiAmount = (weiAmount: BigNumberish, decimalDigits = 4) =>
  truncate(utils.commify(utils.formatEther(weiAmount)), decimalDigits);
