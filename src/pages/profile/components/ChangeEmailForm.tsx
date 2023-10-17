import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineSave } from "react-icons/ai";
import { TbMail } from "react-icons/tb";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { styled } from "styled-components";
import Button from "../../../components/common/button";
import useChangeEmail from "../hooks/useChangeEmail";
import { ProfileData } from "../entities";

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
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 20px 0;

  & label {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    transform: translate(17px, 47px);
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
      transform: translate(7px, 7px) scale(0.8);
    }

    &:focus,
    &:valid {
      border: 1px solid var(--color-white);
    }
  }

  & p {
    font-size: 16px;
    color: var(--color-warning);
    margin: 10px;
  }
`;

const HtmlButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 10px 20px 20px;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const EmailIcon = styled(TbMail)`
  font-size: 25px;
  margin: 0 10px;
`;

const schema = z.object({
  email: z.string().email(),
});
export type FormDataType = z.infer<typeof schema>;

interface Props {
  closeModal: () => void;
}

const ChangeEmailForm = ({ closeModal }: Props) => {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData<ProfileData>(["profile"]);

  const {
    register,
    handleSubmit,
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
      <HtmlInput>
        <input
          {...register("email")}
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
