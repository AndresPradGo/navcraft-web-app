
import { useState, useEffect } from 'react';
import useSideBar from '../../sidebar/useSideBar';

export interface ReturnType {
    isOpen: boolean;
    handleOpen: () => void;
    handleClose: () => void;
}

const useModal = (): ReturnType => {
    const [isOpen, setIsOpen] = useState(false);
    const {hasSideBar, handleExpandSideBar} = useSideBar()
    
    useEffect(() => {
        return () => {
          document.removeEventListener("keydown", hadleEscapeKey, true);
          document.body.style.overflow = 'auto';
        }
    }, [])

    const hadleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") handleClose();
    };
    
    const handleOpen = () => {
        if(hasSideBar) handleExpandSideBar(false)
        document.addEventListener("keydown", hadleEscapeKey, true);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };
    
    const handleClose = () => {
        document.removeEventListener("keydown", hadleEscapeKey, true);
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    return {isOpen, handleOpen, handleClose}
}

export default useModal