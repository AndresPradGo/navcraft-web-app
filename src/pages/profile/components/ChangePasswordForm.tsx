import { AiOutlineSave } from "react-icons/ai";
import { TbLock, TbLockCheck, TbLockOpen } from "react-icons/tb";
import { useForm, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { styled } from "styled-components";
import Button from "../../../components/common/button";
import useChangePassword from "../hooks/useChangePassword";

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

const LockIcon = styled(TbLock)`
  font-size: 25px;
  margin: 0 10px;
`;

const LockCheckIcon = styled(TbLockCheck)`
  font-size: 25px;
  margin: 0 10px;
`;

const UnlockIcon = styled(TbLockOpen)`
  font-size: 25px;
  margin: 0 10px;
`;

const passwordSchema = z
  .string()
  .min(8, { message: "Must be at least 8 characters long" })
  .max(25, { message: "Must be at most 25 characters long" })
  .refine((password) => !/\s/.test(password), {
    message: "Cannot contain white spaces",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Must contain at least one number",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Must contain at least one lowercase letter",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Must contain at least one uppercase letter",
  });

const schema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: z.string(),
});
type FormDataType = z.infer<typeof schema>;

interface Props {
  closeModal: () => void;
}

const ChangePasswordForm = ({ closeModal }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
  });

  const changePassword = useChangePassword();

  const handleCancel = () => {
    reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    closeModal();
  };

  const submitHandler = (data: FieldValues) => {
    if (data.confirmPassword !== data.newPassword)
      setError("confirmPassword", {
        type: "manual",
        message: "Password confirmation does not match",
      });
    else {
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      closeModal();
      changePassword.mutate({
        current_password: data.currentPassword,
        password: data.newPassword,
      });
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <HtmlInput>
        <input
          {...register("currentPassword")}
          id="currentPassword"
          type="password"
          autoComplete="off"
          required={true}
        />
        {errors.currentPassword ? (
          <p>{errors.currentPassword.message}</p>
        ) : (
          <p>&nbsp;</p>
        )}
        <label htmlFor="currentPassword">
          <UnlockIcon />
          Current Password
        </label>
      </HtmlInput>
      <HtmlInput>
        <input
          {...register("newPassword")}
          id="newPassword"
          type="password"
          autoComplete="off"
          required={true}
        />
        {errors.newPassword ? (
          <p>{errors.newPassword.message}</p>
        ) : (
          <p>&nbsp;</p>
        )}
        <label htmlFor="newPassword">
          <LockIcon />
          New Password
        </label>
      </HtmlInput>
      <HtmlInput>
        <input
          {...register("confirmPassword")}
          id="confirmPassword"
          type="password"
          autoComplete="off"
          required={true}
        />
        {errors.confirmPassword ? (
          <p>{errors.confirmPassword.message}</p>
        ) : (
          <p>&nbsp;</p>
        )}
        <label htmlFor="confirmPassword">
          <LockCheckIcon />
          Confirm Password
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

export default ChangePasswordForm;
