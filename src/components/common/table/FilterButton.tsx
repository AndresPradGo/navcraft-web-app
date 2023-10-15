import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";

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
  overflow: hidden;
  z-index: 10;
  margin: 0;
  padding: ${(props) => (props.$expanded ? "5px 0" : "0")};
  border: ${(props) =>
    props.$expanded ? "1px groove var(--color-grey-bright)" : "none"};
  border-radius: 5px;
  background-color: var(--color-primary-bright);
`;

const HtmlCheckbox = styled.label`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s linear;
  min-width: calc(280px - 2px);
  color: var(--color-grey-bright);
  background-color: var(--color-primary-bright);
  padding: 10px 10px 10px 20px;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: var(--color-primary);
  }

  & input[type="checkbox"] {
    cursor: pointer;
    margin: 0;
    border-radius: 30px;
    border: none;
    outline: none;
    background-color: var(--color-primary);
    font-size: 2px;

    min-height: 15px;
    min-width: 15px;
  }

  & span {
    text-align: left;
    flex-grow: 1;
    cursor: pointer;
    margin-left: 10px;
    text-wrap: wrap;
  }
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
          <VscFilterFilled />
        ) : (
          <VscFilter />
        )}
      </Button>
      <HtmlForm
        $expanded={popperTools.isExpanded}
        ref={popperTools.setReferences.popper}
        style={popperTools.styles}
      >
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
