export type TableAction = {
  label: string;
  onClick: React.MouseEventHandler<HTMLLIElement>;
};

export type TableActionsProps = {
  actions: TableAction[];
};
