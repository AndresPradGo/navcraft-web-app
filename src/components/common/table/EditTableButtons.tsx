import { styled } from "styled-components";
import { RiDeleteBinLine, RiEditFill, RiArrowRightLine } from "react-icons/ri";

import Button from "../Button";

const HtmlButtonGroup = styled.div`
  display: flex;

  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  aligh-content: center;

  @media screen and (min-width: 1024px) {
    justify-content: space-evenly;
  }
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 14px;
`;

const EditIcon = styled(RiEditFill)`
  font-size: 14px;
`;

const OpenIcon = styled(RiArrowRightLine)`
  font-size: 14px;
`;

interface Props {
  href: string;
  onDelete: () => void;
  editable: "edit" | "open";
}

const EditTableButtons = ({ href, onDelete, editable }: Props) => {
  if (editable === "edit")
    return (
      <HtmlButtonGroup>
        <Button href={href} height={24} spaceChildren={true} borderRadious={40}>
          EDIT
          <EditIcon />
        </Button>
        <Button
          color={"var(--color-white)"}
          hoverColor={"var(--color-white)"}
          backgroundColor={"var(--color-warning)"}
          backgroundHoverColor={"var(--color-warning-hover)"}
          height={24}
          spaceChildren={true}
          borderRadious={40}
          handleClick={onDelete}
        >
          DELETE
          <DeleteIcon />
        </Button>
      </HtmlButtonGroup>
    );

  return (
    <HtmlButtonGroup>
      <Button href={href} height={24} spaceChildren={true} borderRadious={40}>
        DETAILS
        <OpenIcon />
      </Button>
    </HtmlButtonGroup>
  );
};

export default EditTableButtons;
