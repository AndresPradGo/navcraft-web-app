import { FormEvent, useState, useEffect } from 'react';
import { AiOutlineSave } from 'react-icons/ai';
import { FaUserGear, FaUserCheck, FaUserShield } from 'react-icons/fa6';
import { LiaTimesSolid } from 'react-icons/lia';
import { styled } from 'styled-components';

import Button from '../../components/common/button';
import useEditUser from './useEditUser';

const HtmlForm = styled.form`
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
    font-size: 25px;

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

const HtmlInputContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);
`;

const HtmlCheckbox = styled.label`
  display: flex;
  min-width: 0;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  transition: all 0.2s linear;

  color: var(--color-grey-bright);
  padding: 10px 10px 10px 20px;
  cursor: pointer;
  flex-grow: 0;

  &:hover,
  &:focus {
    background-color: var(--color-primary);
  }

  & input[type='checkbox'] {
    cursor: pointer;
    margin: 0;
    min-height: 20px;
    min-width: 20px;
    transition: all 0.2s linear;
  }

  & span {
    display: flex;
    align-items: center;
    text-align: left;
    cursor: pointer;
    margin-left: 5px;
    text-wrap: wrap;
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

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const AdminIcon = styled(FaUserShield)`
  font-size: 25px;
  margin: 0 10px;
`;

const ActiveIcon = styled(FaUserCheck)`
  font-size: 25px;
  margin: 0 10px;
`;

const EditUserIcon = styled(FaUserGear)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 10px;
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

interface UserDataFromForm {
  id: number;
  is_admin: boolean;
  is_active: boolean;
}

interface Props {
  userData: UserDataFromForm;
  closeModal: () => void;
  isOpen: boolean;
}

const EditUserForm = ({ userData, closeModal, isOpen }: Props) => {
  const [userState, setUserState] = useState(userData);
  const editUserMutation = useEditUser();

  useEffect(() => {
    if (isOpen) setUserState(userData);
  }, [isOpen]);

  const handleSelectItem = (box: 'active' | 'admin') => {
    const newState = { ...userState };
    if (box === 'active') newState.is_active = !newState.is_active;
    else if (box === 'admin') newState.is_admin = !newState.is_admin;

    setUserState(newState);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    closeModal();
    editUserMutation.mutate({
      id: userData.id,
      make_admin: userState.is_admin,
      activate: userState.is_active,
    });
  };

  return (
    <HtmlForm onSubmit={handleSubmit}>
      <h1>
        <div>
          <EditUserIcon />
          Edit User
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <HtmlCheckbox htmlFor="active-user">
          <input
            type="checkbox"
            id="active-user"
            onChange={() => handleSelectItem('active')}
            checked={userState.is_active}
          />
          <span>
            <ActiveIcon />
            Active User
          </span>
        </HtmlCheckbox>
        <HtmlCheckbox htmlFor="admin-user">
          <input
            type="checkbox"
            id="admin-user"
            onChange={() => handleSelectItem('admin')}
            checked={userState.is_admin}
          />
          <span>
            <AdminIcon />
            Admin User
          </span>
        </HtmlCheckbox>
      </HtmlInputContainer>
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

export default EditUserForm;
