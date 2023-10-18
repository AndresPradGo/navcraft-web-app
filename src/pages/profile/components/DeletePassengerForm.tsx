import { IoWarningOutline } from "react-icons/io5";

import { RiDeleteBinLine } from "react-icons/ri";
import { styled } from "styled-components";

import Button from "../../../components/common/button";
import useDeletePassenger from "../hooks/useDeletePassenger";

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
  text-wrap: wrap;
  width: 100%;
  margin: 0;
  padding: 5px;
  display: flex;
  align-items: center;
  font-size: 25px;

  @media screen and (min-width: 425px) {
    padding: 10px;
    font-size: 32px;
  }

  `;

const BodyContainer = styled.div`
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
  font-size: 30px;
  margin: 0 7px;
  color: var(--color-white);
  background-color: var(--color-warning);
  padding: 0 5px 5px;

  height: 40px;
  width: 40px;
  border-radius: 50%;

  @media screen and (min-width: 425px) {
    height: 50px;
    width: 50px;
    margin: 0 15px;
  }
`;
interface Props {
  closeModal: () => void;
  name: string;
  id: number;
}

const DeletePassengerForm = ({ closeModal, name, id }: Props) => {
  const deleteMutation = useDeletePassenger();

  const handleDelete = () => {
    closeModal();
    deleteMutation.mutate({
      id: id,
      name: name,
    });
  };

  return (
    <HtmlContainer>
      <h1>
        <TitleIcon />
        Delete Passenger
      </h1>
      <BodyContainer>
        <p>{`Are you sure you want to delete "${name}" from your passengers' list?`}</p>
      </BodyContainer>
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

export default DeletePassengerForm;
