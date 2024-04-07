import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBinLine, RiArrowRightLine } from 'react-icons/ri';
import { styled } from 'styled-components';

import Button from '../button/Button';
import type { ReactIconType } from '../../../services/reactIconEntity';

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

const DeleteIcon = styled(RiDeleteBinLine as ReactIconType)`
  font-size: 14px;
`;

const EditIcon = styled(BiSolidEditAlt as ReactIconType)`
  font-size: 14px;
`;

const OpenIcon = styled(RiArrowRightLine as ReactIconType)`
  font-size: 14px;
`;

export interface Props {
  id: number;
  handleEdit: string | (() => void);
  handleDelete: () => void;
  permissions?: 'open' | 'edit' | 'delete' | 'open-delete' | 'edit-delete';
}

const EditTableButtons = ({
  handleEdit,
  handleDelete,
  permissions,
  id,
}: Props) => {
  if (!permissions) return <HtmlButtonGroup />;
  if (permissions === 'edit-delete')
    return (
      <HtmlButtonGroup>
        <Button
          href={typeof handleEdit === 'string' ? handleEdit : undefined}
          handleClick={typeof handleEdit !== 'string' ? handleEdit : undefined}
          height="24px"
          borderRadious={40}
          dataTestid={`table-edit-button-${id}`}
        >
          EDIT
          <EditIcon />
        </Button>
        <Button
          color="var(--color-grey_bright)"
          hoverColor="var(--color-white)"
          backgroundColor="var(--color-warning)"
          backgroundHoverColor="var(--color-warning-hover)"
          height="24px"
          margin="10px"
          borderRadious={40}
          handleClick={handleDelete}
          dataTestid={`table-delete-button-${id}`}
        >
          DELETE
          <DeleteIcon />
        </Button>
      </HtmlButtonGroup>
    );
  if (permissions === 'open-delete')
    return (
      <HtmlButtonGroup>
        <Button
          href={typeof handleEdit === 'string' ? handleEdit : undefined}
          handleClick={typeof handleEdit !== 'string' ? handleEdit : undefined}
          height="24px"
          borderRadious={40}
          dataTestid={`table-edit-button-${id}`}
        >
          DETAILS
          <OpenIcon />
        </Button>
        <Button
          color="var(--color-grey-bright)"
          hoverColor="var(--color-white)"
          backgroundColor="var(--color-warning)"
          backgroundHoverColor="var(--color-warning-hover)"
          height="24px"
          margin="10px"
          borderRadious={40}
          handleClick={handleDelete}
          dataTestid={`table-delete-button-${id}`}
        >
          DELETE
          <DeleteIcon />
        </Button>
      </HtmlButtonGroup>
    );
  if (permissions === 'delete')
    return (
      <HtmlButtonGroup>
        <Button
          color="var(--color-grey-bright)"
          hoverColor="var(--color-white)"
          backgroundColor="var(--color-warning)"
          backgroundHoverColor="var(--color-warning-hover)"
          height="24px"
          margin="10px"
          borderRadious={40}
          handleClick={handleDelete}
          dataTestid={`table-delete-button-${id}`}
        >
          DELETE
          <DeleteIcon />
        </Button>
      </HtmlButtonGroup>
    );
  return (
    <HtmlButtonGroup>
      <Button
        href={typeof handleEdit === 'string' ? handleEdit : undefined}
        handleClick={typeof handleEdit !== 'string' ? handleEdit : undefined}
        height="24px"
        borderRadious={40}
        margin="10px"
        dataTestid={`table-edit-button-${id}`}
      >
        {permissions === 'edit' ? (
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
