import React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box, { BoxProps } from '@mui/material/Box';
import { PageViewProps } from './PageView.types';

const HEADER_HEIGHT = 150;

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
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  paddingBottom: theme.spacing(2),
  top: 0,
}));

export const PageHeaderContainer = styled('div')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.borderGrey.main}`,
  padding: theme.spacing(1),
  position: 'sticky',
  top: 0,
  paddingBottom: 6,
}));

export const PageView = ({
  title,
  children,
  contentContainerSx = {},
}: PageViewProps) => (
  <PageAligner>
    <Container
      sx={{
        p: { xs: 0 },
        maxWidth: { xs: 1300 },
        width: '90%',
        maxHeight: '85vh',
        overflowY: 'auto',
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
