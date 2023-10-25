
import { useState, Dispatch, SetStateAction, CSSProperties} from 'react';
import { usePopper } from "react-popper";
import { useEffect } from 'react';

interface SetReferenceFunctions {
  input: Dispatch<SetStateAction<HTMLInputElement | null>>;
  popper: Dispatch<SetStateAction<HTMLElement | null>>;
}

interface PopperToolsType {
  closeExpandible: () => void;
  handleInputClick: () => void;
  setReferences: SetReferenceFunctions;
  isExpanded: boolean;
  styles: CSSProperties;
  inputRef: HTMLInputElement | null
}

const usePopperInput = (): PopperToolsType => {
    
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [listRef, setListRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    return () => {
      document.removeEventListener("click", hadleClickOutside, true);
      document.removeEventListener("keydown", hadleEscapeKey, true);
    }
  }, [])

  const { styles } = usePopper(inputRef, listRef, {
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
        !inputRef?.contains(event.target as Node)
      ) closeExpandible()
  };

  const hadleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeExpandible();
  };

  const handleInputClick = () => {
    if (!isExpanded) {
      document.addEventListener("click", hadleClickOutside, true);
      document.addEventListener("keydown", hadleEscapeKey, true);
    }
    setIsExpanded(!isExpanded);
  };

  return {
    closeExpandible,
    handleInputClick,
    setReferences: {
      input: setInputRef,
      popper:setListRef
    },
    isExpanded,
    styles: styles.popper,
    inputRef
  }
}

export default usePopperInput;