import { styled } from '@mui/material/styles';

export const PageContainer = styled('div')(({ theme }) => ({
  borderRadius: 8,
  backgroundImage: theme.palette.boxGradient,
  width: '80%',
  maxWidth: 1100,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const PageAligner = styled('div')({
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const PageHeader = styled('div')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.borderGrey.main}`,
  padding: theme.spacing(1),
  paddingBottom: 6,
}));

export const PageContentContainer = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
}));
