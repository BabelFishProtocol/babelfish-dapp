export enum DelegateStakeFields {
  delegateTo = 'delegateTo',
}

export type DelegateStakeValues = {
  [DelegateStakeFields.delegateTo]: string;
};

export const delegateStakeDefaultValues = {
  [DelegateStakeFields.delegateTo]: '',
};
