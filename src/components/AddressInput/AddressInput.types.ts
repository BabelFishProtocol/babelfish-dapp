import {
  TextInputProps,
  ControlledInputType,
} from '../TextInput/TextInput.types';

export type AddressInputProps = TextInputProps;

export type ControlledAddressInputProps<FormValues> =
  ControlledInputType<FormValues> & AddressInputProps;
