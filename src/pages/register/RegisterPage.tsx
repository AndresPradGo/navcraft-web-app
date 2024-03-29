import { Link } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { TfiEmail } from 'react-icons/tfi';
import { TbLock, TbLockCheck } from 'react-icons/tb';
import { AiOutlineForm } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa6';
import { z } from 'zod';
import { styled } from 'styled-components';

import Button from '../../components/common/button/index';
import useRegister from './useRegister';
import useSetTitle from '../../hooks/useSetTitle';
import Loader from '../../components/Loader';

const HtmlPageContainer = styled.div`
  position: relative;
  width: 100vw;
  min-height: 800px;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 10px;
  overflow: hidden;
  z-index: 5;

  @media screen and (min-width: 1024px) {
    width: calc(100vw - 10px);
    padding-right: 0;
  }
`;

const HtmlFormContainer = styled.div`
  position: relative;
  width: 300px;
  height: 658px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-primary-dark);
  border-radius: 8px;
  overflow: hidden;
  z-index: 5;

  &::before {
    content: ' ';
    position: absolute;
    bottom: 50%;
    right: 50%;
    width: 388px;
    height: 658px;
    background: linear-gradient(
      90deg,
      #50a5e2,
      #50a5e2,
      #50a5e2,
      transparent,
      transparent
    );
    z-index: 1;
    animation: spin-reverse 6s linear infinite;
    -webkit-animation: spin-reverse 6s linear infinite;
    transform-origin: bottom right;
  }

  &::after {
    content: ' ';
    position: absolute;
    bottom: 50%;
    right: 50%;
    width: 388px;
    height: 658px;
    background: linear-gradient(
      90deg,
      #50a5e2,
      #50a5e2,
      #50a5e2,
      transparent,
      transparent
    );
    z-index: 1;
    animation: spin-reverse 6s linear infinite;
    -webkit-animation: spin-reverse 6s linear infinite;
    transform-origin: bottom right;
    animation-delay: -3s;
  }

  @media screen and (min-width: 425px) {
    width: 388px;
  }
`;

const HtmlAnimationSpan = styled.span`
  position: absolute;
  top: 0;
  inset: 0;

  &::before {
    content: ' ';
    position: absolute;
    bottom: 50%;
    right: 50%;
    width: 388px;
    height: 658px;
    background: linear-gradient(
      90deg,
      #f0ad05,
      #f0ad05,
      #f0ad05,
      transparent,
      transparent
    );
    z-index: 1;
    animation: spin-reverse 6s linear infinite;
    -webkit-animation: spin-reverse 6s linear infinite;
    transform-origin: bottom right;
    animation-delay: -4.5s;
  }

  &::after {
    content: ' ';
    position: absolute;
    bottom: 50%;
    right: 50%;
    width: 388px;
    height: 658px;
    background: linear-gradient(
      90deg,
      #f0ad05,
      #f0ad05,
      #f0ad05,
      transparent,
      transparent
    );
    z-index: 1;
    animation: spin-reverse 6s linear infinite;
    -webkit-animation: spin-reverse 6s linear infinite;
    transform-origin: bottom right;
    animation-delay: -1.5s;
  }
`;

const HtmlRegisterForm = styled.form`
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-basis: 292px;
  flex-shrink: 0;
  height: 650px;

  background-color: var(--color-primary);
  border-radius: 8px;
  padding: 30px 20px;

  & h1 {
    letter-spacing: 3px;
    margin: 0 0 -10px 0;
  }

  @media screen and (min-width: 425px) {
    flex-basis: 380px;
  }
`;

const HtmlInputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 55px;

  & span {
    font-size: 16px;
    position: absolute;
    left: 0;
    display: inline-flex;
    height: 56px;
    justify-content: center;
    align-items: center;
    padding: 20px 0 10px;
    pointer-events: none;
    transition: all 0.3s linear;
    color: var(--color-grey-bright);
  }

  & i {
    z-index: 2;
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: var(--color-white);
    transition: all 0.3s linear;
    overflow: hidden;
    pointer-events: none;
    border-radius: 4px;
  }

  & p {
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 12px;
    color: var(--color-warning);
    margin: 10px 0;
    transform: translateY(40px);
  }

  @media screen and (min-width: 425px) {
    & p {
      font-size: 16px;
    }
  }
`;
interface RequiredInput {
  required: string;
}
const HtmlInputField = styled.input<RequiredInput>`
  position: relative;
  z-index: 10;
  width: 100%;
  padding: 20px 10px 10px;
  background: transparent;
  outline: none;
  box-shadow: none;
  color: var(--color-primary);
  border: 0;
  font-size: 16px;
  letter-spacing: 0.8px;
  transition: all 0.3s linear;
  border-radius: 4px;

  &:valid ~ span,
  &:focus ~ span {
    color: var(--color-white);
    font-size: 12px;
    transform: translateY(-44px);
  }

  &:valid ~ i,
  &:focus ~ i {
    height: 48px;
    border-radius: 4px;
  }
`;

const UserIcon = styled(FaUser)`
  margin-right: 10px;
`;

const EmailIcon = styled(TfiEmail)`
  margin-right: 10px;
`;

const LockIcon = styled(TbLock)`
  font-size: 22px;
  margin-right: 10px;
`;

const LockCheckIcon = styled(TbLockCheck)`
  font-size: 22px;
  margin-right: 10px;
`;

const RegisterIcon = styled(AiOutlineForm)`
  font-size: 25px;
  margin-left: 10px;
`;

const HtmlRegisterContainer = styled.div`
  margin-top: 10px;
`;

const HtmlRegisterLink = styled(Link)`
  color: var(--color-highlight);
  margin-left: 10px;

  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

const passwordSchema = z
  .string()
  .min(8, { message: 'Must be at least 8 characters long' })
  .max(25, { message: 'Must be at most 25 characters long' })
  .refine((password) => !/\s/.test(password), {
    message: 'Cannot contain white spaces',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Must contain at least one number',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Must contain at least one lowercase letter',
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Must contain at least one uppercase letter',
  });

const schema = z.object({
  name: z
    .string()
    .min(2, { message: 'Must be at least 2 characters long' })
    .max(255, { message: 'Must be at most 255 characters long' })
    .regex(/^[a-zA-Z0-9\s']+$/, {
      message: "Only letters, numbers, spaces and symbol '",
    }),
  email: z.string().email(),
  password: passwordSchema,
  confirmPassword: z.string(),
});
type FormDataType = z.infer<typeof schema>;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  const navigate = useNavigate();
  const registerMutation = useRegister(() => {
    navigate('/profile');
  });

  useSetTitle('Register');

  const submitHandler = (data: FieldValues) => {
    if (data.confirmPassword !== data.password)
      setError('confirmPassword', {
        type: 'manual',
        message: 'Password confirmation does not match',
      });
    else
      registerMutation.mutate({
        name: data.name as string,
        email: data.email as string,
        password: data.password as string,
      });
  };
  return (
    <HtmlPageContainer>
      <HtmlFormContainer>
        <HtmlAnimationSpan />
        <HtmlRegisterForm onSubmit={handleSubmit(submitHandler) as () => void}>
          {registerMutation.isLoading ? (
            <Loader />
          ) : (
            <>
              <h1>Register</h1>
              <HtmlInputContainer>
                <HtmlInputField
                  {...register('name')}
                  id="name"
                  type="text"
                  required="required"
                />
                <span>
                  <UserIcon />
                  Name
                </span>
                <i></i>
                {errors.name && <p>{errors.name.message}</p>}
              </HtmlInputContainer>
              <HtmlInputContainer>
                <HtmlInputField
                  {...register('email')}
                  id="email"
                  type="text"
                  required="required"
                />
                <span>
                  <EmailIcon />
                  Email
                </span>
                <i></i>
                {errors.email && <p>{errors.email.message}</p>}
              </HtmlInputContainer>
              <HtmlInputContainer>
                <HtmlInputField
                  {...register('password')}
                  id="password"
                  type="password"
                  required="required"
                />
                <span>
                  <LockIcon />
                  Password
                </span>
                <i></i>
                {errors.password && <p>{errors.password.message}</p>}
              </HtmlInputContainer>
              <HtmlInputContainer>
                <HtmlInputField
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  required="required"
                />
                <span>
                  <LockCheckIcon />
                  Confirm Password
                </span>
                <i></i>
                {errors.confirmPassword && (
                  <p>{errors.confirmPassword.message}</p>
                )}
              </HtmlInputContainer>
              <Button
                color="var(--color-primary-dark)"
                hoverColor="var(--color-grey-dark)"
                backgroundColor="var(--color-white)"
                backgroundHoverColor="var(--color-grey-bright)"
                width="100%"
                height="40px"
                padding="9px 25px"
                margin="40px 0 0"
                spaceChildren="center"
                fontSize={16}
                borderRadious={4}
                btnType="submit"
              >
                Register <RegisterIcon />
              </Button>
              <HtmlRegisterContainer>
                Already have an account?
                <HtmlRegisterLink to="/login">Login</HtmlRegisterLink>
              </HtmlRegisterContainer>
            </>
          )}
        </HtmlRegisterForm>
      </HtmlFormContainer>
    </HtmlPageContainer>
  );
};

export default RegisterPage;
