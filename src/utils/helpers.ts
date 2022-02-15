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

export const timestampToDate = (timestamp: number) =>
  new Date(timestamp * 1000);

export const formatDate = (date: Date) => date.toUTCString();

export const formatTimestamp: CellParser = (timestamp) =>
  formatDate(timestampToDate(Number(timestamp)));
