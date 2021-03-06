import { ContainerProps } from '@mui/material/Container';
import { BoxProps } from '@mui/material/Box';

export type PageViewProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  contentContainerSx?: BoxProps['sx'];
  sx?: ContainerProps['sx'];
};
