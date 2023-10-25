import {
  Dispatch,
  SetStateAction,
  ReactNode,
  ChangeEvent,
  FocusEvent,
  useReducer,
  useEffect,
} from "react";
import { styled } from "styled-components";

import usePopperInput from "./usePopperInput";
import dataListReducer from "./dataListReducer";

interface RequiredInputProps {
  $accepted: boolean;
  $hasValue: boolean;
  $required: boolean;
}
const HtmlInput = styled.div<RequiredInputProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 20px 0;

  & label {
    cursor: ${(props) => (props.$hasValue ? "default" : "text")};
    position: absolute;
    top: 0;
    left: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    transform: ${(props) =>
      props.$hasValue
        ? "translate(7px, 7px) scale(0.8)"
        : "translate(17px, 47px)"};
    color: ${(props) =>
      props.$hasValue
        ? props.$accepted
          ? "var(--color-grey-bright)"
          : "var(--color-highlight)"
        : "var(--color-grey-bright)"};
    transition: transform 0.3s;

    & span {
      margin: 0 15px;
    }
  }

  & input {
    width: 100%;
    padding: 10px 20px;
    margin: 0;
    margin-top: 30px;
    border-radius: 5px;
    background-color: var(--color-grey-dark);
    outline: none;
    border: 1px solid
      ${(props) =>
        props.$hasValue
          ? props.$accepted
            ? "var(--color-grey)"
            : "var(--color-highlight)"
          : "var(--color-grey)"};
    color: var(--color-white);
    font-size: 20px;

    &:focus ~ label {
      cursor: default;
      color: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? "var(--color-white)"
          : "var(--color-highlight)"};
      transform: translate(7px, 7px) scale(0.8);
    }

    &:focus {
      box-shadow: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? "0"
          : "0 0 6px 0 var(--color-highlight)"};
      border: 1px solid
        ${(props) =>
          props.$accepted && (props.$hasValue || !props.$required)
            ? "var(--color-white)"
            : "var(--color-highlight)"};
    }
  }

  & p {
    font-size: 16px;
    color: var(--color-warning-hover);
    margin: 2px;
    text-wrap: wrap;
  }
`;

interface HtmlListProps {
  ref: Dispatch<SetStateAction<HTMLElement | null>>;
  $required: boolean;
  $expanded: boolean;
}

const HtmlList = styled.ul<HtmlListProps>`
  width: calc(100% - 40px);
  transition: all 0.2s ease-out;
  max-height: ${(props) => (props.$expanded ? "200px" : "0")};
  overflow-x: hidden;
  overflow-y: ${(props) => (props.$expanded ? "auto" : "hidden")};
  z-index: 10;
  margin: 0;
  padding: ${(props) => (props.$expanded ? "5px 0" : "0")};
  list-style-type: none;
  border: ${(props) =>
    props.$expanded ? "1px groove var(--color-grey)" : "none"};
  border-radius: 5px;
  background-color: var(--color-grey-dark);
`;

const HtmlListItem = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s linear;
  color: var(--color-grey-bright);
  background-color: var(--color-grey-dark);
  padding: 10px 20px;

  &:hover,
  &:focus {
    background-color: var(--color-grey);
    color: var(--color-white);
  }
`;

interface Props {
  value: string;
  resetValue: string;
  setValue: (value: string) => void;
  hasError: boolean;
  errorMessage: string;
  setError: (message: string) => void;
  clearErrors: () => void;
  options: string[];
  children: ReactNode;
  name: string;
  required: boolean;
  formIsOpen: boolean;
}

const DataList = ({
  value,
  setValue,
  required,
  name,
  children,
  hasError,
  errorMessage,
  setError,
  clearErrors,
  options,
  formIsOpen,
  resetValue,
}: Props) => {
  const positionPopperTools = usePopperInput();
  const [filteredOptions, dispatch] = useReducer(dataListReducer, options);

  useEffect(() => {
    if (formIsOpen && positionPopperTools.inputRef) {
      positionPopperTools.inputRef.value = resetValue;
      dispatch({ type: "FILTER", value: resetValue, options });
    }
  }, [formIsOpen]);

  const handleListItemClick = (index: number) => {
    positionPopperTools.closeExpandible();
    if (positionPopperTools.inputRef) {
      positionPopperTools.inputRef.value = filteredOptions[index];
    }
    setValue(filteredOptions[index]);
    clearErrors();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;
    setValue(currentValue);
    if (
      options.filter((option) =>
        option.toLowerCase().startsWith(currentValue.toLowerCase())
      ).length ||
      (!required && currentValue === "")
    )
      clearErrors();
    if (currentValue === "") dispatch({ type: "RESET", options });
    else dispatch({ type: "FILTER", value: currentValue, options });
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;
    if (
      required &&
      !options.filter(
        (option) => option.toLowerCase() === currentValue.toLowerCase()
      ).length
    ) {
      setError("Select a valid option");
    } else clearErrors();
    positionPopperTools.closeExpandible;
  };

  return (
    <HtmlInput $required={required} $hasValue={!!value} $accepted={!hasError}>
      <input
        id={name}
        type="text"
        required={required}
        autoComplete="off"
        ref={positionPopperTools.setReferences.input}
        onFocus={positionPopperTools.handleInputClick}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {filteredOptions.length ? (
        <HtmlList
          ref={positionPopperTools.setReferences.popper}
          $expanded={positionPopperTools.isExpanded}
          $required={required}
          style={positionPopperTools.styles}
        >
          {filteredOptions.map((option, index) => (
            <HtmlListItem
              key={option}
              onClick={() => handleListItemClick((index = index))}
            >
              {option}
            </HtmlListItem>
          ))}
        </HtmlList>
      ) : null}
      {hasError ? <p>{errorMessage}</p> : <p>&nbsp;</p>}
      <label htmlFor={name}>{children}</label>
    </HtmlInput>
  );
};

export default DataList;
