import { LiaTimesSolid } from "react-icons/lia";
import { styled } from "styled-components";
import { Dispatch } from "react";

import { FilterAction } from "./filtersReducer";
import { FilterWithValueType } from "./FilterButton";

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
  filters: FilterWithValueType[];
  dispatch: Dispatch<FilterAction>;
}

const FilterTags = ({ filters, dispatch }: Props) => {
  return (
    <HtmlContainer>
      {filters.map((filter, idx) =>
        filter.selected ? (
          <HtmlFilterTag key={`${filter.key}-${filter.value}`}>
            <span>{filter.title}</span>
            <LiaTimesSolid
              onClick={() => dispatch({ type: "CHANGE", index: idx })}
            />
          </HtmlFilterTag>
        ) : null
      )}
    </HtmlContainer>
  );
};

export default FilterTags;
