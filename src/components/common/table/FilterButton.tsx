import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { VscFilter, VscFilterFilled } from 'react-icons/vsc';
import { TbFilterOff } from 'react-icons/tb';

import Button from '../button/Button';
import { usePopperButton } from '../button';
import { FilterAction } from './filtersReducer';
import type { ReactIconType } from '../../../services/reactIconEntity';

interface HtmlFormProps {
  ref: Dispatch<SetStateAction<HTMLElement | null>>;
  $expanded: boolean;
}

const HtmlForm = styled.ul<HtmlFormProps>`
  transition: all 0.2s ease-out;
  max-height: ${(props) => (props.$expanded ? '300px' : '0')};
  width: 280px;
  overflow-x: hidden;
  overflow-y: ${(props) => (props.$expanded ? 'auto' : 'hidden')};
  z-index: 10;
  margin: 0;
  padding: ${(props) => (props.$expanded ? '5px 0' : '0')};
  border: ${(props) =>
    props.$expanded ? '1px groove var(--color-grey-bright)' : 'none'};
  border-radius: 5px;
  background-color: var(--color-primary-light);

  & button {
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 0;
    border: none;
    transition: all 0.2s linear;
    min-width: 280px;
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
  min-width: 278px;
  color: var(--color-grey-bright);
  background-color: var(--color-primary-light);
  padding: 10px 10px 10px 20px;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: var(--color-primary);
  }

  & input[type='checkbox'] {
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

const FilterIcon = styled(VscFilter as ReactIconType)`
  font-size: 20px;
`;

const FilterFilledIcon = styled(VscFilterFilled as ReactIconType)`
  font-size: 20px;
`;

export interface FiltersType {
  key: string;
  value: string;
  title: string;
}

export interface FilterParametersType {
  text: string;
  filters: FiltersType[];
}

interface Props {
  text: string;
  dispatch: Dispatch<FilterAction>;
  filters: FiltersType[];
  appliedFilters: number[];
}

const FilterButton = ({ text, filters, appliedFilters, dispatch }: Props) => {
  const popperTools = usePopperButton();

  const handleSelectItem = (index: number, remove: boolean) => {
    if (remove) dispatch({ type: 'REMOVE', index: index });
    else dispatch({ type: 'ADD', index: index });
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
        margin="10px 5px"
        onlyHover={true}
      >
        {text}
        {appliedFilters.length ? <FilterFilledIcon /> : <FilterIcon />}
      </Button>
      <HtmlForm
        $expanded={popperTools.isExpanded}
        ref={popperTools.setReferences.popper}
        style={popperTools.styles}
      >
        <button
          onClick={() => {
            dispatch({ type: 'CLEAR' });
            popperTools.closeExpandible();
          }}
        >
          Clear all <TbFilterOff />
        </button>
        {filters.map((filter, idx) => {
          const selected =
            !!appliedFilters.find((i) => i === idx) ||
            appliedFilters.find((i) => i === idx) === 0;
          return (
            <HtmlCheckbox key={`checkbox-${idx}`} htmlFor={`checkbox-${idx}`}>
              <input
                type="checkbox"
                id={`checkbox-${idx}`}
                onChange={() => handleSelectItem(idx, selected)}
                checked={selected}
              />
              <span>{filter.title}</span>
            </HtmlCheckbox>
          );
        })}
      </HtmlForm>
    </>
  );
};

export default FilterButton;
