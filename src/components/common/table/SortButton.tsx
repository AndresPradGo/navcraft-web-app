import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { HiArrowUp, HiArrowNarrowDown } from "react-icons/hi";
import Button from "../button/Button";
import { usePopperButton } from "../button";

interface HtmlListProps {
  ref: Dispatch<SetStateAction<HTMLElement | null>>;
  $expanded: boolean;
}

const HtmlList = styled.ul<HtmlListProps>`
  transition: all 0.2s ease-out;
  max-height: ${(props) => (props.$expanded ? "100vh" : "0")};
  overflow: hidden;
  z-index: 10;
  margin: 0;
  padding: ${(props) => (props.$expanded ? "5px 0" : "0")};
  list-style-type: none;
  border: ${(props) =>
    props.$expanded ? "1px groove var(--color-grey-bright)" : "none"};
  border-radius: 5px;
  background-color: var(--color-primary-bright);
`;

const HtmlListItem = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s linear;
  min-width: calc(280px - 2px);
  color: var(--color-grey-bright);
  background-color: var(--color-primary-bright);
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
  changeSelectedSortData: (newSotData: SortDataType) => void;
}

const SortButton = ({
  sortOptions,
  selectedSortData,
  changeSelectedSortData,
}: Props) => {
  const popperTools = usePopperButton();

  const handleListItemClick = (index: number) => {
    popperTools.closeExpandible();

    const selectingSameColumn = selectedSortData.index === index;
    const selectedOrderIsAscending = selectedSortData.order === "asc";
    changeSelectedSortData({
      index: index,
      order:
        !selectingSameColumn ||
        (selectingSameColumn && !selectedOrderIsAscending)
          ? "asc"
          : "desc",
    });
  };

  const arrowIcons = {
    asc: <HiArrowUp />,
    desc: <HiArrowNarrowDown />,
  };

  return (
    <>
      <Button
        color="var(--color-grey-bright)"
        hoverColor="var(--color-white)"
        backgroundColor="var(--color-grey-bright)"
        backgroundHoverColor="var(--color-white)"
        fill={false}
        reference={popperTools.setReferences.button}
        handleClick={popperTools.handleButtonClick}
        shadow={false}
        height={40}
        width={280}
        fontSize={16}
        borderRadious={5}
        spaceChildren="space-between"
        padding="10px 20px"
      >
        Sort by:&nbsp;
        {sortOptions[selectedSortData.index].title}
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
