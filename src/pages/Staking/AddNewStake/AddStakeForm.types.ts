import { DialogProps } from '@mui/material/Dialog';
import { DateSelectorProps } from '../../../components/DateSelector/DateSelector.types';

export type AddNewStakeContainerProps = Pick<DialogProps, 'open'> & {
  onClose: () => void;
};

export type AddNewStakeComponentProps = AddNewStakeContainerProps &
  Pick<DateSelectorProps, 'kickoffTs' | 'stakes'>;
