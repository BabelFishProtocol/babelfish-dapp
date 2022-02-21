import { utils } from 'ethers';

import { CellParser } from '../components/DataTable/DataTable.types';

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

export const formatDateUTC = (date: Date) => date.toUTCString();

export const formatDate = (date: Date) => date.toLocaleDateString();

export const formatTimestamp: CellParser = (timestamp) =>
  timestamp ? formatDate(timestampToDate(Number(timestamp))) : '';

export const formatTimestampToUTC: CellParser = (timestamp) =>
  timestamp ? formatDateUTC(timestampToDate(Number(timestamp))) : '';
