import { Link } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { MdOutlineLogin } from 'react-icons/md';
import { TfiEmail } from 'react-icons/tfi';
import { TbLockOpen } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { styled } from 'styled-components';
import Button from '../../components/common/button/index';
import useLogin from './useLogin';
import useAuth from '../../hooks/useAuth';
import useSetTitle from '../../hooks/useSetTitle';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import useTrial from './useTrial';

const HtmlPageContainer = styled.div`
  position: relative;
  width: 100vw;
  min-height: 600px;
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
  height: 510px;
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
    top: 50%;
    left: 50%;
    width: 388px;
    height: 510px;
    background: linear-gradient(
      0deg,
      #50a5e2,
      #50a5e2,
      #50a5e2,
      transparent,
      transparent
    );
    z-index: 1;
    animation: spin 6s linear infinite;
    -webkit-animation: spin 6s linear infinite;
    transform-origin: top left;
  }

  &::after {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 388px;
    height: 510px;
    background: linear-gradient(
      0deg,
      #50a5e2,
      #50a5e2,
      #50a5e2,
      transparent,
      transparent
    );
    z-index: 1;
    animation: spin 6s linear infinite;
    -webkit-animation: spin 6s linear infinite;
    transform-origin: top left;
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
    top: 50%;
    left: 50%;
    width: 388px;
    height: 510px;
    background: linear-gradient(
      0deg,
      #f0ad05,
      #f0ad05,
      #f0ad05,
      transparent,
      transparent
    );
    z-index: 1;
    animation: spin 6s linear infinite;
    -webkit-animation: spin 6s linear infinite;
    transform-origin: top left;
    animation-delay: -4.5s;
  }

  &::after {
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 388px;
    height: 510px;
    background: linear-gradient(
      0deg,
      #f0ad05,
      #f0ad05,
      #f0ad05,
      transparent,
      transparent
    );
    z-index: 1;
    animation: spin 6s linear infinite;
    -webkit-animation: spin 6s linear infinite;
    transform-origin: top left;
    animation-delay: -1.5s;
  }
`;

const HtmlLoginForm = styled.form`
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-basis: 292px;
  flex-shrink: 0;
  height: 502px;

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

const EmailIcon = styled(TfiEmail)`
  margin-right: 10px;
`;

const LockIcon = styled(TbLockOpen)`
  font-size: 22px;
  margin-right: 10px;
`;

const LoginIcon = styled(MdOutlineLogin)`
  font-size: 25px;
  margin-left: 10px;
`;

const TrialIcon = styled(IoShieldCheckmarkOutline)`
  font-size: 25px;
  margin-left: 10px;
`;

const HtmlRegisterContainer = styled.div`
  margin-top: 10px;

  &::after {
    content: 'Or';
    margin-top: 5px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
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
  email: z.string().email(),
  password: passwordSchema,
});

type FormDataType = z.infer<typeof schema>;

const LoginPage = () => {
  const userIsLogedin = useAuth();
  if (userIsLogedin) return <Navigate to="/flights" />;

  const [searchParams, _] = useSearchParams();
  const credentials = searchParams.get('credentials');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataType>({ resolver: zodResolver(schema) });

  const navigate = useNavigate();
  const login = useLogin(() => {
    navigate('/flights');
  });
  const trialMutation = useTrial(() => {
    navigate('/flights');
  });

  useSetTitle('Login');

  useEffect(() => {
    if (credentials && credentials === 'invalid') {
      toast.error(
        'Invalid credentials, please login with a valid email and password, or start a new trial.',
        {
          position: 'top-center',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        },
      );
      navigate('/login');
    }
  }, []);

  const submitHandler = (data: FieldValues) => {
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);
    login.mutate(formData);
  };
  return (
    <HtmlPageContainer>
      <HtmlFormContainer>
        <HtmlAnimationSpan />
        <HtmlLoginForm onSubmit={handleSubmit(submitHandler)}>
          {login.isLoading ? (
            <Loader />
          ) : (
            <>
              <h1>Login</h1>
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
                Login <LoginIcon />
              </Button>
              <HtmlRegisterContainer>
                Don't have an account?
                <HtmlRegisterLink to="/register">Register</HtmlRegisterLink>
              </HtmlRegisterContainer>
              <Button
                color="var(--color-primary-dark)"
                hoverColor="var(--color-grey-dark)"
                backgroundColor="var(--color-contrast)"
                backgroundHoverColor="var(--color-contrast-hover)"
                width="100%"
                height="40px"
                padding="9px 25px"
                margin="20px 0 0"
                spaceChildren="center"
                fontSize={16}
                borderRadious={4}
                btnType="button"
                handleClick={trialMutation.mutate}
              >
                Try as Guest <TrialIcon />
              </Button>
            </>
          )}
        </HtmlLoginForm>
      </HtmlFormContainer>
    </HtmlPageContainer>
  );
};

export default LoginPage;
