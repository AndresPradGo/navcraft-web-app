import { useState, DragEvent } from "react";
import { GiWeight, GiRadialBalance } from "react-icons/gi";
import { LiaTimesSolid } from "react-icons/lia";
import { styled } from "styled-components";

import { LimitDataType } from "./EditWeightBalanceProfileForm";

const HtmlContainer = styled.div`
  color: var(--color-grey-bright);
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  padding: 10px;
  margin: 10px 0;

  & h3 {
    align-self: flex-start;
    margin: 10px 0;
    color: var(--color-grey-bright);
  }
`;

interface HtmlTagProps {
  $cursor: "grab" | "grabbing" | "copy";
  $draggedOver: boolean;
}

const HtmlTag = styled.div<HtmlTagProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 5px;
  width: 220px;
  padding: 10px;
  border: 1px solid var(--color-grey);
  background-color: var(--color-primary);
  border-radius: 3px;
  cursor: ${(props) => props.$cursor};
  font-size: 14px;
  opacity: ${(props) => (props.$draggedOver ? 0.2 : 1)};

  & span {
    display: flex;
    align-items: center;
  }

  & svg {
    font-size: 20px;
  }
`;

const CloseIcon = styled(LiaTimesSolid)`
  cursor: pointer;
  color: var(--color-grey);
  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

const WeightIcon = styled(GiWeight)`
  margin: 0 0 0 5px;
`;
const COGIcon = styled(GiRadialBalance)`
  margin: 0 2px 0 0;
`;

interface Props {
  limits: LimitDataType[];
  setLimits: (newLimits: LimitDataType[]) => void;
}

const WeightBalanceLimitsList = ({ limits, setLimits }: Props) => {
  const [draggedLimitIdx, setDraggedLimitIdx] = useState<number | null>(null);
  const [dragOverLimitIdx, setDragOverLimitIdx] = useState<number | null>(null);
  const [cursor, setCursor] = useState<"grab" | "grabbing" | "copy">("grab");

  const handleRemoveLimit = (index: number) => {
    const newLimits = [...limits];
    newLimits.splice(index, 1);
    setLimits(newLimits);
  };

  const handleDragStart = (index: number) => {
    setCursor("grabbing");
    setDraggedLimitIdx(index);
  };

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const handleDrop = () => {
    if (draggedLimitIdx !== null && dragOverLimitIdx !== null) {
      const newLimits = [...limits];
      const dragItem = newLimits.splice(draggedLimitIdx, 1)[0];
      newLimits.splice(dragOverLimitIdx, 0, dragItem);
      setLimits(newLimits);
    }
  };

  const handleDragEnter = (index: number) => {
    setCursor("copy");
    setDragOverLimitIdx(index);
  };

  const handleDragEnd = () => {
    setCursor("grab");
    setDraggedLimitIdx(null);
    setDragOverLimitIdx(null);
  };

  return (
    <HtmlContainer>
      {limits.length ? <h3>Added Points:</h3> : null}
      {limits.map((limit, idx) => (
        <HtmlTag
          key={idx}
          $cursor={cursor}
          $draggedOver={dragOverLimitIdx === idx}
          draggable
          onMouseDown={() => {
            setCursor("grabbing");
          }}
          onMouseUp={() => {
            setCursor("grab");
          }}
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={handleDrop}
          onDragEnter={() => handleDragEnter(idx)}
          onDragEnd={handleDragEnd}
        >
          <span>
            <COGIcon />
            {limit.cg_location_in}
          </span>
          <span>
            <WeightIcon />
            {limit.weight_lb}
          </span>
          <CloseIcon onClick={() => handleRemoveLimit(idx)} />
        </HtmlTag>
      ))}
    </HtmlContainer>
  );
};

export default WeightBalanceLimitsList;
