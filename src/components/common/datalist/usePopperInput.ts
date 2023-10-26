
import { useState, Dispatch, SetStateAction, CSSProperties} from 'react';
import { usePopper } from "react-popper";
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
    setIsExpanded(false);
  };

  const handleInputClick = () => {
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