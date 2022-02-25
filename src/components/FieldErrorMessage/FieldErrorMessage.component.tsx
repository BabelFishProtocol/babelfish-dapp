import { FieldError } from 'react-hook-form';

import Typography from '@mui/material/Typography';

import { fieldsErrors } from '../../constants';
import { FieldErrorMessageProps } from './FieldErrorMessage.types';

export const getFieldError = (error: FieldError | undefined) => {
  if (!error) {
    return undefined;
  }

  const messageByType = fieldsErrors[error.type as keyof typeof fieldsErrors];
  if (messageByType) {
    return messageByType;
  }
  if (error.message) {
    return error.message;
  }
  return 'invalid field';
};

export const FieldErrorMessage = ({ error }: FieldErrorMessageProps) => (
  <Typography color="error">{getFieldError(error)}</Typography>
);
