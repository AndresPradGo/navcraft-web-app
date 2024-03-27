import { LiaTimesSolid } from 'react-icons/lia';
import { styled } from 'styled-components';
import { Dispatch } from 'react';

import { FilterAction } from './filtersReducer';
import { FiltersType } from './FilterButton';

const HtmlContainer = styled.div`
  width: 98%;
  margin: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const HtmlFilterTag = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0 10px 5px 0;
  padding: 10px;
  border: 2px solid var(--color-grey);
  border-radius: 8px;
  font-size: 26px;

  & span {
    cursor: default;
    margin-right: 10px;
    font-size: 16px;
  }

  & svg {
    cursor: pointer;

    &:hover,
    &:focus {
      color: var(--color-white);
    }
  }
`;

interface Props {
  selectedFilters: number[];
  filters: FiltersType[];
  dispatch: Dispatch<FilterAction>;
}

const FilterTags = ({ filters, selectedFilters, dispatch }: Props) => {
  return (
    <HtmlContainer>
      {selectedFilters.map((idx) => {
        const filter = filters[idx];
        if (filter) {
          return (
            <HtmlFilterTag key={`${filter.key}-${filter.value}`}>
              <span>{filter.title}</span>
              <LiaTimesSolid
                onClick={() => dispatch({ type: 'REMOVE', index: idx })}
              />
            </HtmlFilterTag>
          );
        }
        return null;
      })}
    </HtmlContainer>
  );
};

export default FilterTags;
