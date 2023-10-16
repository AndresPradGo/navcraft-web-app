import { AiOutlineSave } from "react-icons/ai";
import { TbMail } from "react-icons/tb";

import { styled } from "styled-components";
import Button from "../../components/common/button/index";

const HtmlForm = styled.form`
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  padding: 10px;
`;

const HtmlInput = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 20px 0;

  & label {
    font-size: 20px;
    display: flex;
    align-items: center;
    transform: translateY(-37px);
    transition: transform 0.3s;
  }

  & input {
    width: 100%;
    padding: 10px 20px;
    margin: 0;
    margin-top: 30px;
    border-radius: 5px;
    background-color: var(--color-grey-dark);
    outline: none;
    border: 1px solid var(--color-grey);
    color: var(--color-white);
    font-size: 20px;

    &:valid ~ label,
    &:focus ~ label {
      color: var(--color-white);
      transform: translate(-10px, -75px) scale(0.8);
    }

    &:focus {
      border: 1px solid var(--color-white);
    }
  }
`;

const HtmlButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 0 20px 20px;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const EmailIcon = styled(TbMail)`
  font-size: 25px;
  margin: 0 10px;
`;

interface Props {
  closeModal: () => void;
}

const ChangeEmailForm = ({ closeModal }: Props) => {
  return (
    <HtmlForm>
      <HtmlInput>
        <input id="email" type="text" autoComplete="off" required={true} />
        <label htmlFor="email">
          <EmailIcon />
          New Email
        </label>
      </HtmlInput>
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
          btnType="button"
          width="120px"
          height="35px"
        >
          Cancel
        </Button>
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          backgroundColor="var(--color-contrast)"
          backgroundHoverColor="var(--color-contrast-hover)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          btnType="submit"
          width="120px"
          height="35px"
          spaceChildren="space-evenly"
        >
          Save
          <SaveIcon />
        </Button>
      </HtmlButtons>
    </HtmlForm>
  );
};

export default ChangeEmailForm;
