import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { styled } from "styled-components";

import Button from "../../../components/common/button";
import useDeleteAccount from "../hooks/useDeleteAccount";

const HtmlContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  & p {
    text-align: center;
    padding: 10px 20px;
    margin: 0;
    font-size: 20px;
    cursor: default;
  }
`;

const HtmlButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 20px 20px 10px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 20px;
  margin-left: 5px;
`;

interface Props {
  closeModal: () => void;
}

const DeleteAccountForm = ({ closeModal }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteAccount(() => {
    queryClient.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("token_type");
    navigate("/register");
  });

  const handleDelete = () => {
    deleteMutation.mutate(undefined);
  };

  return (
    <HtmlContainer>
      <p>
        All your saved data will be lost. Are you sure you want to delete your
        account?
      </p>
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

export default DeleteAccountForm;
