import { render, screen } from '@testing-library/react';
import { getAmountColumn } from '../../pages/Staking/Staking.columns';
import { formatTimestamp } from '../../utils/helpers';

import { DataTable } from './DataTable.component';
import { mockDataTable, vestListColumns, vestListItem } from './DataTable.mock';

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('@mui/material/styles/createPalette', () => ({
  createPalette: jest.fn(),
}));

const checkDisplayedHeaders = () => {
  const header = screen.getByText(`${mockDataTable.tableTitle}`);
  expect(header).toBeInTheDocument();
  vestListColumns.forEach((column) => {
    expect(screen.getByText(column.label as string)).toBeInTheDocument();
  });
};

const checkDisplayedTable = () => {
  checkDisplayedHeaders();
  vestListItem.forEach((item, index) => {
    expect(screen.getAllByText(item.asset)[index]).toBeInTheDocument();
    expect(screen.getByText(item.lockedAmount)).toBeInTheDocument();
    expect(screen.getByText(item.votingDelegation)).toBeInTheDocument();
  });

  expect(screen.getAllByText(vestListItem[0].stakingPeriodStart)).toHaveLength(
    5
  );
  expect(screen.getAllByText(vestListItem[1].unlockDate)).toHaveLength(3);
};

describe('DataTable', () => {
  it('display correctly', async () => {
    render(<DataTable {...mockDataTable} />);
    checkDisplayedTable();
  });
  it('display update state', async () => {
    render(<DataTable {...{ ...mockDataTable, state: 'loading' }} />);

    checkDisplayedTable();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('display loading state', async () => {
    render(<DataTable {...{ ...mockDataTable, data: [], state: 'loading' }} />);

    checkDisplayedHeaders();
    expect(screen.getByTestId('loading-state-row')).toBeInTheDocument();

    vestListItem.forEach((item, index) => {
      expect(screen.queryAllByText(item.asset)[index]).toBeUndefined();
      expect(screen.queryByText(item.lockedAmount)).toBeNull();
      expect(screen.queryByText(item.votingDelegation)).toBeNull();
    });
  });

  it('displays error state', async () => {
    render(<DataTable {...{ ...mockDataTable, state: 'failure' }} />);

    checkDisplayedHeaders();
    expect(screen.getByTestId('error-state-row')).toBeInTheDocument();
  });

  it('display empty state', async () => {
    render(<DataTable {...{ ...mockDataTable, data: [] }} />);

    checkDisplayedHeaders();
    expect(screen.getByText('No stakes yet.')).toBeInTheDocument();

    vestListItem.forEach((item, index) => {
      expect(screen.queryAllByText(item.asset)[index]).toBeUndefined();
      expect(screen.queryByText(item.lockedAmount)).toBeNull();
      expect(screen.queryByText(item.votingDelegation)).toBeNull();
    });
  });

  it('display table with formatted data and custom component', async () => {
    vestListColumns[3].format = formatTimestamp;
    vestListColumns[1].component = getAmountColumn('lockedAmount');
    const mockedData = {
      ...mockDataTable,
      columns: vestListColumns,
    };

    render(<DataTable {...mockedData} />);
    expect(screen.getAllByText('August 4, 2022 12:00 am')).toHaveLength(2);
    expect(screen.getByText('9,552.8567 FISH')).toBeInTheDocument();
    expect(screen.getByText('2,552.8567 FISH')).toBeInTheDocument();
  });
});
