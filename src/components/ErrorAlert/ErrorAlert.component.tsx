import { useCallback } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { errorMessageSelector } from '../../store/app/app.selectors';
import { appActions } from '../../store/app/app.slice';

export const ErrorAlert = () => {
  const dispatch = useDispatch();
  const message = useSelector(errorMessageSelector);

  const handleClose = useCallback(() => {
    dispatch(appActions.setErrorMessage(undefined));
  }, [dispatch]);

  if (!message) return null;

  return (
    <Snackbar open autoHideDuration={8000} onClose={handleClose}>
      <Alert
        sx={{ width: '100%' }}
        variant="filled"
        severity="error"
        onClose={handleClose}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
