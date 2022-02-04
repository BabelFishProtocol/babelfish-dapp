import React from 'react';
import styled from '@mui/material/styles/styled';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { PageViewProps } from './PageView.types';

export const PageAligner = styled('div')({
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const PageHeaderContainer = styled('div')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.borderGrey.main}`,
  padding: theme.spacing(1),
  paddingBottom: 6,
}));

export const PageView = ({ title, children }: PageViewProps) => (
  <PageAligner>
    <Container>
      <PageHeaderContainer>{title}</PageHeaderContainer>
      <Box
        sx={{
          padding: ({ spacing }) => spacing(4, 3),
        }}
      >
        {children}
      </Box>
    </Container>
  </PageAligner>
);
