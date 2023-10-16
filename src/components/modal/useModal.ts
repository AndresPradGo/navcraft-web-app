
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface ReturnType {
    isOpen: boolean;
    handleOpen: () => void;
    handleClose: () => void;
    setModalRef: Dispatch<SetStateAction<HTMLElement | null>>;
}

const useModal = (): ReturnType => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalRef, setModalRef] = useState<HTMLElement | null>(null);
    
    useEffect(() => {
        return () => {
          document.removeEventListener("click", hadleClickOutside, true);
          document.removeEventListener("keydown", hadleEscapeKey, true);
          document.body.style.overflow = 'auto';
        }
    }, [])

    
    const hadleClickOutside = (event: MouseEvent) => {
        if (!modalRef?.contains(event.target as Node))
            handleClose();
    };

    const hadleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") handleClose();
    };
    
    const handleOpen = () => {
        document.addEventListener("click", hadleClickOutside, true);
        document.addEventListener("keydown", hadleEscapeKey, true);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };
    
    const handleClose = () => {
        document.removeEventListener("click", hadleClickOutside, true);
        document.removeEventListener("keydown", hadleEscapeKey, true);
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    return {isOpen, handleOpen, handleClose, setModalRef}
}

export default useModal