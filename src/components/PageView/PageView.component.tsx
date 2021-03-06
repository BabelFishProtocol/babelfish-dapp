import styled from '@mui/material/styles/styled';
import Container from '@mui/material/Container';
import Box, { BoxProps } from '@mui/material/Box';
import { PageViewProps } from './PageView.types';

export const CenteredBox = ({ sx, ...boxProps }: BoxProps) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...sx,
    }}
    {...boxProps}
  />
);

export const PageAligner = styled(CenteredBox)(({ theme }) => ({
  width: '100%',
  paddingBottom: theme.spacing(4),
}));

export const PageHeaderContainer = styled('div')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.borderGrey.main}`,
  padding: theme.spacing(1),
  paddingBottom: 6,
}));

export const PageView = ({
  title,
  children,
  contentContainerSx = {},
  sx,
}: PageViewProps) => (
  <PageAligner>
    <Container
      sx={{
        p: { xs: 0 },
        maxWidth: { xs: 1400 },
        width: '90%',
        height: '100%',
        ...sx,
      }}
    >
      <PageHeaderContainer>{title}</PageHeaderContainer>
      <Box
        sx={{
          padding: ({ spacing }) => spacing(4, 3),
          ...contentContainerSx,
        }}
      >
        {children}
      </Box>
    </Container>
  </PageAligner>
);
