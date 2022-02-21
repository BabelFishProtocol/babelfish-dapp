import { useState } from 'react';

export const useStakeModalForm = (
  selectStake: () => void,
  clearSelectedStake: () => void
) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowForm = () => {
    selectStake();
    setShowModal(true);
  };
  const handleCloseForm = () => {
    clearSelectedStake();
    setShowModal(false);
  };

  return [showModal, handleShowForm, handleCloseForm] as const;
};
