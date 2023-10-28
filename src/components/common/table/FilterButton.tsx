import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";
import { TbFilterOff } from "react-icons/tb";

import Button from "../button/Button";
import { usePopperButton } from "../button";
import { FilterAction } from "./filtersReducer";

interface HtmlFormProps {
  ref: Dispatch<SetStateAction<HTMLElement | null>>;
  $expanded: boolean;
}

const HtmlForm = styled.ul<HtmlFormProps>`
  transition: all 0.2s ease-out;
  max-height: ${(props) => (props.$expanded ? "500px" : "0")};
  max-width: 280px;
  overflow-x: hidden;
  overflow-y: ${(props) => (props.$expanded ? "auto" : "hidden")};
  z-index: 10;
  margin: 0;
  padding: ${(props) => (props.$expanded ? "5px 0" : "0")};
  border: ${(props) =>
    props.$expanded ? "1px groove var(--color-grey-bright)" : "none"};
  border-radius: 5px;
  background-color: var(--color-primary-light);

  & button {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 0;
    border: none;
    transition: all 0.2s linear;
    min-width: calc(280px - 2px);
    color: var(--color-grey-bright);
    background-color: var(--color-primary-light);
    padding: 10px 10px 10px 20px;
    cursor: pointer;
    font-size: 16px;

    &:hover,
    &:focus {
      background-color: var(--color-primary);
    }

    & svg {
      font-size: 22px;
      margin-left: 15px;
    }
  }
`;

const HtmlCheckbox = styled.label`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s linear;
  min-width: calc(280px - 2px);
  color: var(--color-grey-bright);
  background-color: var(--color-primary-light);
  padding: 10px 10px 10px 20px;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: var(--color-primary);
  }

  & input[type="checkbox"] {
    cursor: pointer;
    margin: 0;
    min-height: 15px;
    min-width: 15px;
    transition: all 0.2s linear;
  }

  & span {
    text-align: left;
    flex-grow: 1;
    cursor: pointer;
    margin-left: 10px;
    text-wrap: wrap;
  }
`;

const FilterIcon = styled(VscFilter)`
  font-size: 20px;
`;

const FilterFilledIcon = styled(VscFilterFilled)`
  font-size: 20px;
`;

export interface FiltersType {
  key: string;
  value: string;
  title: string;
}

export interface FilterWithValueType extends FiltersType {
  selected: boolean;
}

export interface FilterParametersType {
  text: string;
  filters: FiltersType[];
}

interface Props {
  text: string;
  dispatch: Dispatch<FilterAction>;
  filters: FilterWithValueType[];
}

const FilterButton = ({ text, filters, dispatch }: Props) => {
  const popperTools = usePopperButton();

  const handleSelectItem = (index: number) => {
    dispatch({ type: "CHANGE", index: index });
  };

  return (
    <>
      <Button
        color="var(--color-primary-dark)"
        hoverColor="var(--color-primary-dark)"
        backgroundColor="var(--color-grey)"
        backgroundHoverColor="var(--color-grey-bright)"
        fill={true}
        reference={popperTools.setReferences.button}
        handleClick={popperTools.handleButtonClick}
        shadow={false}
        height="40px"
        width="280px"
        fontSize={16}
        borderRadious={5}
        spaceChildren="space-between"
        padding="10px 20px"
        margin="10px 0"
      >
        {text}
        {filters.some((item) => item.selected) ? (
          <FilterFilledIcon />
        ) : (
          <FilterIcon />
        )}
      </Button>
      <HtmlForm
        $expanded={popperTools.isExpanded}
        ref={popperTools.setReferences.popper}
        style={popperTools.styles}
      >
        <button
          onClick={() => {
            dispatch({ type: "CLEAR" });
            popperTools.closeExpandible();
          }}
        >
          Clear all <TbFilterOff />
        </button>
        {filters.map((filter, idx) => (
          <HtmlCheckbox key={`checkbox-${idx}`} htmlFor={`checkbox-${idx}`}>
            <input
              type="checkbox"
              id={`checkbox-${idx}`}
              onChange={() => handleSelectItem(idx)}
              checked={filter.selected}
            />
            <span>{filter.title}</span>
          </HtmlCheckbox>
        ))}
      </HtmlForm>
    </>
  );
};

export default FilterButton;
