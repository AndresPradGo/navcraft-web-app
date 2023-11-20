import { GiWeight, GiRadialBalance } from "react-icons/gi";
import { RiDeleteBinLine } from "react-icons/ri";

import { styled } from "styled-components";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { LimitDataTypeWithId } from "./WeightBalanceLimitsList";

interface HtmlTagProps {
  $cursor: "grab" | "grabbing" | "copy";
}
const HtmlTag = styled.div<HtmlTagProps>`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 5px;
  width: 220px;
  border: 1px solid var(--color-primary-dark);
  background-color: var(--color-primary-bright);
  border-radius: 4px;
  cursor: ${(props) => props.$cursor};
  font-size: 13px;
`;

const HtmlDragabbleContainer = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-start;

  & span {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  & span:first-of-type {
    width: 73px;
  }

  & span:last-of-type {
    width: 86px;
  }

  & svg {
    font-size: 20px;
  }
`;
const CloseIcon = styled.div`
  border-left: 4px solid var(--color-primary-dark);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-warning);
  color: var(--color-grey-bright);
  font-size: 20px;

  width: 40px;
  min-height: 42.5px;
  flex-shrink: 0;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: var(--color-warning-hover);
    color: var(--color-white);
  }
`;

const WeightIcon = styled(GiWeight)`
  margin: 0 2px 0 5px;
`;
const COGIcon = styled(GiRadialBalance)`
  margin: 0 2px 0 0;
`;

interface Props {
  index: number;
  limit: LimitDataTypeWithId;
  handleRemoveLimit: (index: number) => void;
  cursor: "grab" | "grabbing";
  setCursor: (cursor: "grab" | "grabbing") => void;
}

const SortableLimit = ({
  limit,
  handleRemoveLimit,
  index,
  cursor,
  setCursor,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: limit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <HtmlTag
      ref={setNodeRef}
      style={style}
      {...attributes}
      $cursor={cursor}
      data-no-dnd="true"
    >
      <HtmlDragabbleContainer
        {...listeners}
        onMouseDown={() => {
          setCursor("grabbing");
        }}
        onMouseUp={() => {
          setCursor("grab");
        }}
      >
        <span>
          <COGIcon />
          {limit.cg_location_in}
        </span>
        <span>
          <WeightIcon />
          {limit.weight_lb}
        </span>
      </HtmlDragabbleContainer>
      <CloseIcon onClick={() => handleRemoveLimit(index)}>
        <RiDeleteBinLine />
      </CloseIcon>
    </HtmlTag>
  );
};

export default SortableLimit;
