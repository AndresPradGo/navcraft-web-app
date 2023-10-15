
import { useState, Dispatch, SetStateAction, CSSProperties} from 'react';
import { usePopper } from "react-popper";
import { useEffect } from 'react';

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

  useEffect(() => {
    return () => {
      document.removeEventListener("click", hadleClickOutside, true);
      document.removeEventListener("keydown", hadleEscapeKey, true);
    }
  }, [])

  const { styles } = usePopper(buttonRef, listRef, {
    placement: "bottom",
    modifiers: [
      {
        name: "offset",
        options: { offset: [0, 5] },
      },
      {
        name: "preventOverflow",
        options: {
          padding: 0,
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: [],
        },
      },
    ],
  });

  const closeExpandible = () => {
    document.removeEventListener("click", hadleClickOutside, true);
    document.removeEventListener("keydown", hadleEscapeKey, true);
    setIsExpanded(false);
  };

  const hadleClickOutside = (event: MouseEvent) => {
      if (
        !listRef?.contains(event.target as Node) &&
        !buttonRef?.contains(event.target as Node)
      ) closeExpandible()
  };

  const hadleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeExpandible();
  };

  const handleButtonClick = () => {
    if (!isExpanded) {
      document.addEventListener("click", hadleClickOutside, true);
      document.addEventListener("keydown", hadleEscapeKey, true);
    }
    setIsExpanded(!isExpanded);
  };

  return {
    closeExpandible,
    handleButtonClick,
    setReferences: {
      button: setButtonRef,
      popper:setListRef
    },
    isExpanded,
    styles: styles.popper
  }
}

export default usePopperButton;