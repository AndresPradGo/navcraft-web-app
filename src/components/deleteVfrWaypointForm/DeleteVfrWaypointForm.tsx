import { IoWarningOutline } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";
import { styled } from "styled-components";

import Button from "../common/button";
import useDeleteVfrWaypoint from "./useDeleteVfrWaypoint";
import useDeleteOfficialAerodrome from "./useDeleteOfficialAerodrome";
import { useNavigate } from "react-router-dom";

const HtmlContainer = styled.div`
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  padding: 0;
  overflow: hidden;

  & h1 {
    width: 100%;
    margin: 0;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    text-wrap: wrap;

    & div {
      display: flex;
      align-items: center;
    }

    @media screen and (min-width: 510px) {
      padding: 10px;
      font-size: 32px;
    }
  }
`;

const HtmlBodyContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  text-wrap: wrap;
  overflow-y: auto;
  padding: 20px 0;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);

  & p {
    text-align: start;
    padding: 10px 20px;
    margin: 0;
    font-size: 20px;
    cursor: default;
  }
`;

const HtmlButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 20px;
  margin-left: 5px;
`;

const TitleIcon = styled(IoWarningOutline)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 10px;
  color: var(--color-white);
  background-color: var(--color-warning);
  border-radius: 50%;
  padding: 0 5px 5px;
  height: 40px;
  width: 40px;
  flex-shrink: 0;

  @media screen and (min-width: 510px) {
    padding: 0 5px 5px;
    height: 50px;
    width: 50px;
  }
`;

const CloseIcon = styled(LiaTimesSolid)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 5px;
  cursor: pointer;
  color: var(--color-grey);

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 510px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

interface Props {
  closeModal: () => void;
  name: string;
  id: number;
  redirect?: boolean;
  isAerodrome?: boolean;
}

const DeleteVfrWaypointForm = ({
  closeModal,
  name,
  id,
  isAerodrome,
  redirect,
}: Props) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteVfrWaypoint();
  const deleteAerodromeMutation = useDeleteOfficialAerodrome(() => {
    if (redirect) navigate("/waypoints");
  });

  const handleDelete = () => {
    closeModal();
    const mutationOBJ = { id: id, name: name };
    if (isAerodrome) deleteAerodromeMutation.mutate(mutationOBJ);
    else deleteMutation.mutate(mutationOBJ);
  };

  return (
    <HtmlContainer>
      <h1>
        <div>
          <TitleIcon />
          {`Delete ${isAerodrome ? "Registered Aerodrome" : "VFR Waypoint"}`}
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlBodyContainer>
        {isAerodrome ? (
          <p>{`Are you sure you want to delete "${name}" from the registered aerodromes' list?`}</p>
        ) : (
          <p>{`Are you sure you want to delete "${name}" from the official VFR waypoints' list?`}</p>
        )}
      </HtmlBodyContainer>
      <HtmlButtons>
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          backgroundColor="var(--color-grey)"
          backgroundHoverColor="var(--color-grey-bright)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          handleClick={closeModal}
          width="120px"
          height="35px"
        >
          Cancel
        </Button>
        <Button
          color="var(--color-white)"
          hoverColor="var(--color-white)"
          backgroundColor="var(--color-warning)"
          backgroundHoverColor="var(--color-warning-hover)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          handleClick={handleDelete}
          width="120px"
          height="35px"
        >
          Delete
          <DeleteIcon />
        </Button>
      </HtmlButtons>
    </HtmlContainer>
  );
};

export default DeleteVfrWaypointForm;
