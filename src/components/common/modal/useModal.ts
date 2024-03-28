import { useState, useEffect, useCallback } from 'react';
import useSideBar from '../../sidebar/useSideBar';

export interface ReturnType {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

const useModal = (): ReturnType => {
  const [isOpen, setIsOpen] = useState(false);
  const { hasSideBar, handleExpandSideBar } = useSideBar();

  const handleClose = useCallback(() => {
    document.removeEventListener('keydown', hadleEscapeKey, true);
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hadleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') handleClose();
  }, [handleClose]);

  useEffect(() => {
    return () => {
      document.removeEventListener('keydown', hadleEscapeKey, true);
      document.body.style.overflow = 'auto';
    };
  }, [hadleEscapeKey]);

  const handleOpen = () => {
    if (hasSideBar) handleExpandSideBar(false);
    document.addEventListener('keydown', hadleEscapeKey, true);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };


  return { isOpen, handleOpen, handleClose };
};

export default useModal;
