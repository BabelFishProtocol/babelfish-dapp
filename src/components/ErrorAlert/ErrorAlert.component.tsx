import { useCallback, useEffect, useRef } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { errorMessageSelector } from '../../store/app/app.selectors';
import { appActions } from '../../store/app/app.slice';

export const ErrorAlert = () => {
  const dispatch = useDispatch();
  const message = useSelector(errorMessageSelector);
  const handlerRef = useRef<NodeJS.Timeout>();

  const handleClose = useCallback(() => {
    dispatch(appActions.setErrorMessage(undefined));
  }, [dispatch]);

  useEffect(() => {
    if (handlerRef.current) {
      clearTimeout(handlerRef.current);
      handlerRef.current = undefined;
    }

    if (message) {
      handlerRef.current = setTimeout(handleClose, 5000);
    }
  }, [handleClose, message]);

  return message ? (
    <Alert
      sx={{
        m: '0 32px',
        position: 'absolute',
        bottom: '32px',
        width: 'calc(100% - 64px)',
        '@keyframes flip-horizontal': {
          '0%': {
            webkitTransform: 'rotateX(-360deg)',
            transform: 'rotateX(-360deg)',
          },
          '100%': {
            webkitTransform: 'rotateX(0)',
            transform: 'rotateX(0)',
          },
        },
        webkitAnimation:
          'flip-horizontal 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both',
        animation:
          'flip-horizontal 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both',
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
