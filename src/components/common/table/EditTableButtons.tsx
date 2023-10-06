import { styled } from "styled-components";
import { RiDeleteBinLine, RiEditFill, RiArrowRightLine } from "react-icons/ri";

import Button from "../Button";

const HtmlButtonGroup = styled.div`
  display: flex;
  min-height: 38px;
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

export interface Props {
  href: string;
  onDelete: () => void;
  permissions?: "open" | "edit" | "delete";
}

const EditTableButtons = ({ href, onDelete, permissions }: Props) => {
  if (!permissions) return <HtmlButtonGroup />;
  if (permissions === "delete")
    return (
      <HtmlButtonGroup>
        <Button href={href} height={24} borderRadious={40}>
          EDIT
          <EditIcon />
        </Button>
        <Button
          color="var(--color-white)"
          hoverColor="var(--color-white)"
          backgroundColor="var(--color-warning)"
          backgroundHoverColor="var(--color-warning-hover)"
          height={24}
          margin="10px"
          borderRadious={40}
          handleClick={onDelete}
        >
          DELETE
          <DeleteIcon />
        </Button>
      </HtmlButtonGroup>
    );

  if (permissions === "edit")
    return (
      <HtmlButtonGroup>
        <Button href={href} height={24} borderRadious={40}>
          EDIT
          <EditIcon />
        </Button>
      </HtmlButtonGroup>
    );

  return (
    <HtmlButtonGroup>
      <Button href={href} height={24} borderRadious={40}>
        DETAILS
        <OpenIcon />
      </Button>
    </HtmlButtonGroup>
  );
};

export default EditTableButtons;
