import { useState, useEffect, Dispatch, SetStateAction, CSSProperties, useCallback } from 'react';
import { usePopper } from 'react-popper';
import {  } from 'react';

interface SetReferenceFunctions {
  button: Dispatch<SetStateAction<HTMLElement | null>>;
  popper: Dispatch<SetStateAction<HTMLElement | null>>;
}

interface PopperToolsType {
  closeExpandible: () => void;
  handleButtonClick: () => void;
  setReferences: SetReferenceFunctions;
  isExpanded: boolean;
  styles: CSSProperties;
}

const usePopperButton = (): PopperToolsType => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
  const [listRef, setListRef] = useState<HTMLElement | null>(null);

  const closeExpandible = useCallback(() => {
    document.removeEventListener('click', hadleClickOutside, true);
    document.removeEventListener('keydown', hadleEscapeKey, true);
    setIsExpanded(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hadleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') closeExpandible();
  }, [closeExpandible]);

  const hadleClickOutside = useCallback((event: MouseEvent) => {
    if (
      !listRef?.contains(event.target as Node) &&
      !buttonRef?.contains(event.target as Node)
    )
      closeExpandible();
  }, [listRef, buttonRef, closeExpandible]);

  useEffect(() => {
    return () => {
      document.removeEventListener('click', hadleClickOutside, true);
      document.removeEventListener('keydown', hadleEscapeKey, true);
    };
  }, [hadleClickOutside, hadleEscapeKey]);

  const { styles } = usePopper(buttonRef, listRef, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'offset',
        options: { offset: [0, 5] },
      },
      {
        name: 'preventOverflow',
        options: {
          padding: 0,
        },
      },
      {
        name: 'flip',
        options: {
          fallbackPlacements: [],
        },
      },
    ],
  });

    const handleButtonClick = () => {
    if (!isExpanded) {
      document.addEventListener('click', hadleClickOutside, true);
      document.addEventListener('keydown', hadleEscapeKey, true);
    }
    setIsExpanded(!isExpanded);
  };

  return {
    closeExpandible,
    handleButtonClick,
    setReferences: {
      button: setButtonRef,
      popper: setListRef,
    },
    isExpanded,
    styles: styles.popper,
  };
};

export default usePopperButton;
