export enum DelegateVestFields {
  delegateTo = 'delegateTo',
}

export type DelegateVestValues = {
  [DelegateVestFields.delegateTo]: string;
};

export const delegateVestDefaultValues = {
  [DelegateVestFields.delegateTo]: '',
};
