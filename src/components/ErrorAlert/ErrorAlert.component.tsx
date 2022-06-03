import { Alert, AlertTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { errorMessageSelector } from '../../store/app/app.selectors';
import { appActions } from '../../store/app/app.slice';

export const ErrorAlert = () => {
  const dispatch = useDispatch();
  const message = useSelector(errorMessageSelector);

  const handleClose = () => {
    dispatch(appActions.setErrorMessage(undefined));
  };

  return message ? (
    <Alert
      sx={{
        m: '0 32px',
        position: 'absolute',
        bottom: '32px',
        width: 'calc(100% - 64px)',
      }}
      severity="error"
      variant="filled"
      onClose={handleClose}
    >
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  ) : null;
};
