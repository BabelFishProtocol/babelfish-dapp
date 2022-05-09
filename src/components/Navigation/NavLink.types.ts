import { LinkProps as MuiLinkProps } from '@mui/material';
import { Urls } from '../../constants';

export type LinkProps = MuiLinkProps & {
  to: Urls;
};
