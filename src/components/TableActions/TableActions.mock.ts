import { TableAction } from './TableActions.types';

export const mockMethods = {
  increaseMethodMock: jest.fn(),
  extendMethodMock: jest.fn(),
  unstakeMethodMock: jest.fn(),
  delegateMethodMock: jest.fn(),
};
export const actions: TableAction[] = [
  {
    isDisable: true,
    label: 'Increase',
    onClick: mockMethods.increaseMethodMock,
  },
  {
    label: 'Extend',
    onClick: mockMethods.extendMethodMock,
  },
  {
    label: 'Unstake',
    onClick: mockMethods.unstakeMethodMock,
  },
  {
    isDisable: true,
    label: 'Delegate',
    onClick: mockMethods.delegateMethodMock,
  },
];
