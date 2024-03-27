import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AiOutlineSave } from 'react-icons/ai';
import { LiaTimesSolid } from 'react-icons/lia';
import { TbMail, TbMailCog } from 'react-icons/tb';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { styled } from 'styled-components';
import Button from '../../../components/common/button';
import useChangeEmail from '../hooks/useChangeEmail';
import { ProfileData } from '../entities';

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

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);
`;

interface RequiredInputProps {
  $accepted: boolean;
  $hasValue: boolean;
  $required: boolean;
}
const HtmlInput = styled.div<RequiredInputProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 20px 0;

  & label {
    cursor: ${(props) => (props.$hasValue ? 'default' : 'text')};
    position: absolute;
    top: 0;
    left: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    transform: ${(props) =>
      props.$hasValue
        ? 'translate(7px, 7px) scale(0.8)'
        : 'translate(17px, 47px)'};
    color: ${(props) =>
      props.$hasValue
        ? props.$accepted
          ? 'var(--color-grey-bright)'
          : 'var(--color-highlight)'
        : 'var(--color-grey-bright)'};
    transition: transform 0.3s;

    & span {
      margin: 0 15px;
    }
  }

  & input {
    width: 100%;
    padding: 10px 20px;
    margin: 0;
    margin-top: 30px;
    border-radius: 5px;
    background-color: var(--color-grey-dark);
    outline: none;
    border: 1px solid
      ${(props) =>
        props.$hasValue
          ? props.$accepted
            ? 'var(--color-grey)'
            : 'var(--color-highlight)'
          : 'var(--color-grey)'};
    color: var(--color-white);
    font-size: 20px;

    &:focus ~ label {
      cursor: default;
      color: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? 'var(--color-white)'
          : 'var(--color-highlight)'};
      transform: translate(7px, 7px) scale(0.8);
    }

    &:focus {
      box-shadow: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? '0'
          : '0 0 6px 0 var(--color-highlight)'};
      border: 1px solid
        ${(props) =>
          props.$accepted && (props.$hasValue || !props.$required)
            ? 'var(--color-white)'
            : 'var(--color-highlight)'};
    }
  }

  & p {
    font-size: 16px;
    color: var(--color-warning-hover);
    margin: 2px;
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

const EmailIcon = styled(TbMail)`
  font-size: 25px;
  margin: 0 10px;
`;

const TitleIcon = styled(TbMailCog)`
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

const schema = z.object({
  email: z.string().email(),
});
export type FormDataType = z.infer<typeof schema>;

interface Props {
  closeModal: () => void;
  isOpen: boolean;
}

const ChangeEmailForm = ({ closeModal, isOpen }: Props) => {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData<ProfileData>(['profile']);

  useEffect(() => {
    if (isOpen) {
      reset({
        email: userData?.email,
      });
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: userData?.email,
    },
  });

  const changeEmail = useChangeEmail();

  const handleCancel = () => {
    closeModal();
  };

  const submitHandler = (data: FieldValues) => {
    changeEmail.mutate({ email: data.email });
    closeModal();
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          Change Email
        </div>
        <CloseIcon onClick={handleCancel} />
      </h1>
      <HtmlInputContainer>
        <HtmlInput
          $hasValue={!!watch('email')}
          $accepted={!errors.email}
          $required={true}
        >
          <input
            {...register('email')}
            id="email"
            type="text"
            autoComplete="off"
            required={true}
          />
          {errors.email ? <p>{errors.email.message}</p> : <p>&nbsp;</p>}
          <label htmlFor="email">
            <EmailIcon />
            New Email
          </label>
        </HtmlInput>
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
          handleClick={handleCancel}
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
