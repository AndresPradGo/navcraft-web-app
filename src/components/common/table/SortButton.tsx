import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";

import Button from "../button";
import { usePopperButton } from "../button";
import { SortAction } from "./sortReducer";

interface HtmlListProps {
  ref: Dispatch<SetStateAction<HTMLElement | null>>;
  $expanded: boolean;
}

const HtmlList = styled.ul<HtmlListProps>`
  transition: all 0.2s ease-out;
  width: 280px;
  max-height: ${(props) => (props.$expanded ? "300px" : "0")};
  overflow-x: hidden;
  overflow-y: ${(props) => (props.$expanded ? "auto" : "hidden")};
  z-index: 10;
  margin: 0;
  padding: ${(props) => (props.$expanded ? "5px 0" : "0")};
  list-style-type: none;
  border: ${(props) =>
    props.$expanded ? "1px groove var(--color-grey-bright)" : "none"};
  border-radius: 5px;
  background-color: var(--color-primary-light);
`;

const HtmlListItem = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s linear;
  min-width: 278px;
  color: var(--color-grey-bright);
  background-color: var(--color-primary-light);
  padding: 10px 20px;

  &:hover,
  &:focus {
    background-color: var(--color-primary);
  }
`;

export interface SortColumnType {
  key: string;
  title: string;
}

export interface SortDataType {
  index: number;
  order: "asc" | "desc";
}

interface Props {
  sortOptions: SortColumnType[];
  selectedSortData: SortDataType;
  dispatch: Dispatch<SortAction>;
}

const SortButton = ({ sortOptions, selectedSortData, dispatch }: Props) => {
  const popperTools = usePopperButton();

  const handleListItemClick = (index: number) => {
    popperTools.closeExpandible();
    const selectingSameColumn = selectedSortData.index === index;
    if (selectingSameColumn) dispatch({ type: "SWAP" });
    else dispatch({ type: "CHANGE", value: index });
  };

  const arrowIcons = {
    asc: <HiArrowUp />,
    desc: <HiArrowDown />,
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
        Sort by:&nbsp;
        {sortOptions[selectedSortData.index]
          ? sortOptions[selectedSortData.index].title
          : ""}
        {arrowIcons[selectedSortData.order]}
      </Button>
      <HtmlList
        ref={popperTools.setReferences.popper}
        $expanded={popperTools.isExpanded}
        style={popperTools.styles}
      >
        {sortOptions.map((sortColumn, index) => (
          <HtmlListItem
            key={sortColumn.key}
            onClick={() => handleListItemClick((index = index))}
          >
            {sortColumn.title}
            {index === selectedSortData.index &&
              arrowIcons[selectedSortData.order]}
          </HtmlListItem>
        ))}
      </HtmlList>
    </>
  );
};

export default SortButton;
