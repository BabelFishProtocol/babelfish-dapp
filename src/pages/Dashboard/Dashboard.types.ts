export type BalanceBlockProps = {
  label: string;
  amount: string;
};

export type DashboardComponentProps = {
  fishBalance: BalanceBlockProps['amount'];
  fishVesting: BalanceBlockProps['amount'];
  totalUSD: string;
};
