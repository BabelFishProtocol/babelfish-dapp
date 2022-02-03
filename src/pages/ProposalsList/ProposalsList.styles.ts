import { styled } from '@mui/material/styles';

export const ButtonContainer = styled('div')(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
}));
