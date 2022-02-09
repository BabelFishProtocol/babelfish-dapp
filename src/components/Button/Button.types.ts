import { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export type ButtonProps = MuiButtonProps & {
  isLoading?: boolean;
  loadingText?: string;
};
