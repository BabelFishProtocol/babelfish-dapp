import { parseEther } from 'ethers/lib/utils';
import { render, screen } from '@testing-library/react';

import { BalanceBlock } from './BalanceBlock.component';

afterEach(() => {
  jest.clearAllMocks();
});

describe('BalanceBlock', () => {
  it('displays initial fetching state', async () => {
    render(<BalanceBlock data={undefined} label="test" state="loading" />);

    expect(screen.getByTestId('balanceBlock-skeleton')).toBeInTheDocument();
  });

  it('displays update state', async () => {
    render(<BalanceBlock data="1000000" label="test" state="loading" />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    render(<BalanceBlock data={undefined} label="test" state="failure" />);

    expect(screen.getByText('Unable to load data!')).toBeInTheDocument();
  });

  it('displays empty value as 0', async () => {
    render(
      <BalanceBlock data={undefined} label="test" state="success" asset="USD" />
    );

    expect(screen.getByText('0.0000 USD')).toBeInTheDocument();
  });

  it('displays approximated amount correctly', async () => {
    render(
      <BalanceBlock
        aprox
        label="test"
        asset="USD"
        state="success"
        data={parseEther('1.12345').toString()}
      />
    );

    expect(screen.getByText('≈ 1.1234 USD')).toBeInTheDocument();
  });
});
