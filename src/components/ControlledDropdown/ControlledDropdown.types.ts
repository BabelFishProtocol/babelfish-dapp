import { ControlledInputType } from '../ControlledInput/ControlledInput.types';
import { DropdownProps } from '../Dropdown/Dropdown.types';

export type ControlledDropdownProps<OptionType, FormValues> =
  ControlledInputType<FormValues> & Omit<DropdownProps<OptionType>, 'error'>;
