export type TableAction = {
  isDisable?: boolean;
  label: string;
  onClick: React.MouseEventHandler<HTMLLIElement>;
};

export type TableActionsProps = {
  actions: TableAction[];
};
