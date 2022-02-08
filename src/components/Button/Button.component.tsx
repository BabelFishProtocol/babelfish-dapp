import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { ButtonProps } from './Button.types';

export const Button = ({
  color,
  disabled,
  children,
  loadingText,
  isLoading = false,
  ...buttonProps
}: ButtonProps) => (
  <MuiButton disabled={disabled || isLoading} color={color} {...buttonProps}>
    {isLoading && (
      <CircularProgress size={25} thickness={4} color={color} sx={{ mr: 1 }} />
    )}
    {(isLoading && loadingText) || children}
  </MuiButton>
);
