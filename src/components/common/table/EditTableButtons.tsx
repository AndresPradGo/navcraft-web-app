import { styled } from "styled-components";
import { RiDeleteBinLine, RiEditFill, RiArrowRightLine } from "react-icons/ri";

import Button from "../button/Button";

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

export type EditButtonsPropsTypeUnion =
  | (() => void)
  | ("open" | "edit" | "delete" | undefined);
export interface Props {
  handleEdit: string | (() => void);
  handleDelete: () => void;
  permissions?: "open" | "edit" | "delete";
}

const EditTableButtons = ({ handleEdit, handleDelete, permissions }: Props) => {
  if (!permissions) return <HtmlButtonGroup />;
  if (permissions === "delete")
    return (
      <HtmlButtonGroup>
        <Button
          href={typeof handleEdit === "string" ? handleEdit : undefined}
          handleClick={typeof handleEdit !== "string" ? handleEdit : undefined}
          height="24px"
          borderRadious={40}
        >
          EDIT
          <EditIcon />
        </Button>
        <Button
          color="var(--color-white)"
          hoverColor="var(--color-white)"
          backgroundColor="var(--color-warning)"
          backgroundHoverColor="var(--color-warning-hover)"
          height="24px"
          margin="10px"
          borderRadious={40}
          handleClick={handleDelete}
        >
          DELETE
          <DeleteIcon />
        </Button>
      </HtmlButtonGroup>
    );
  return (
    <HtmlButtonGroup>
      <Button
        href={typeof handleEdit === "string" ? handleEdit : undefined}
        handleClick={typeof handleEdit !== "string" ? handleEdit : undefined}
        height="24px"
        borderRadious={40}
      >
        {permissions === "edit" ? (
          <>
            EDIT <EditIcon />
          </>
        ) : (
          <>
            DETAILS <OpenIcon />
          </>
        )}
      </Button>
    </HtmlButtonGroup>
  );
};

export default EditTableButtons;
