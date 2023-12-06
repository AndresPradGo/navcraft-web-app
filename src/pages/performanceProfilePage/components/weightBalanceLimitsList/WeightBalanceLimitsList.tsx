import { useState } from "react";
import { styled } from "styled-components";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { LimitDataType } from "../EditWeightBalanceProfileForm";
import SortableLimit from "./SortableLimit";

const HtmlContainer = styled.div`
  width: 240px;
  min-height: 340px;
  color: var(--color-grey-bright);
  background-color: var(--color-primary-dark);
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  margin: 0;
  border: 1px solid var(--color-grey);
  border-radius: 3px;

  & h3 {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 14px;
    align-self: flex-start;
    margin: 10px;
    color: var(--color-grey);
  }
`;

export interface LimitDataTypeWithId extends LimitDataType {
  id: string;
}
interface Props {
  limits: LimitDataTypeWithId[];
  setLimits: (newLimits: LimitDataType[]) => void;
}

const WeightBalanceLimitsList = ({ limits, setLimits }: Props) => {
  const [cursor, setCursor] = useState<"grab" | "grabbing">("grab");

  const handleRemoveLimit = (index: number) => {
    console.log("index");
    const newLimits = [...limits];
    newLimits.splice(index, 1);
    setLimits(newLimits);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (active.id !== over?.id) {
      const activeIndex = limits.findIndex((l) => l.id === active.id);
      const overIndex = limits.findIndex((l) => l.id === over?.id);

      const newArray = arrayMove(limits, activeIndex, overIndex);
      setLimits(newArray);
      //return newArray;
    }
    setCursor("grab");
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <HtmlContainer>
        <SortableContext
          items={limits.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <h3>POINTS:</h3>
          {limits.map((limit, idx) => (
            <SortableLimit
              key={limit.id}
              cursor={cursor}
              setCursor={(cursor: "grab" | "grabbing") => setCursor(cursor)}
              index={idx}
              limit={limit}
              handleRemoveLimit={handleRemoveLimit}
            />
          ))}
        </SortableContext>
      </HtmlContainer>
    </DndContext>
  );
};

export default WeightBalanceLimitsList;
