import { BreadcrumbsProps as MUIBreadcrumbsProps } from '@mui/material';

export type BreadcrumbData = {
  title: string;
  href?: string;
};

export type BreadcrumbsProps = MUIBreadcrumbsProps & {
  links: BreadcrumbData[];
};
