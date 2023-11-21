import { useNavigate } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";
import { styled } from "styled-components";

import Button from "../common/button";
import useDeleteProfile from "./useDeletePerformanceProfile";

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

    & div {
      display: flex;
      align-items: center;
      text-wrap: wrap;
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
  id: number;
  name: string;
  aircraftId: number;
  redirect?: boolean;
}

const DeletePerformanceProfileForm = ({
  closeModal,
  id,
  name,
  aircraftId,
  redirect,
}: Props) => {
  const navigate = useNavigate();
  const mutation = useDeleteProfile(aircraftId, () => {
    if (!!redirect) navigate(`/aircraft/${aircraftId}`);
  });

  const handleDelete = () => {
    closeModal();
    mutation.mutate(id);
  };

  return (
    <HtmlContainer>
      <h1>
        <div>
          <TitleIcon />
          Delete Performance Profile
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlBodyContainer>
        <p>{`Are you sure you want to delete the performance profile "${name}"?`}</p>
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
          color="var(--color-grey-bright)"
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

export default DeletePerformanceProfileForm;
