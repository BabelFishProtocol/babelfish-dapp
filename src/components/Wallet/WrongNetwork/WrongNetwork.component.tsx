import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { appActions } from '../../../store/app/app.slice';
import { WrongNetworkModal } from './WrongNetwork.modal';

export const WrongNetwork = () => {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(appActions.setWrongNetworkModal(true));
  };
  return (
    <>
      <Button color="error" onClick={onClick}>
        Wrong network
      </Button>
      <WrongNetworkModal />
    </>
  );
};
