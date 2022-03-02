import {
  ControlledInputType,
  TextInputProps,
} from '../TextInput/TextInput.types';

export type CurrencyInputProps = TextInputProps & {
  symbol: string;
};

export type ControlledCurrencyInputProps<FormValues> =
  ControlledInputType<FormValues> & CurrencyInputProps;
