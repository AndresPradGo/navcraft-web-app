import { Link } from "react-router-dom";
import { MdOutlineLogin } from "react-icons/md";
import { TfiEmail, TfiLock } from "react-icons/tfi";

import { styled } from "styled-components";
import Button from "../components/common/button/index";

const HtmlPageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 10px;
  overflow: hidden;
  z-index: 5;
`;

const HtmlFormContainer = styled.div`
  position: relative;
  inset: 4px;
  width: 300px;
  height: 428px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-primary-dark);
  border-radius: 8px;
  overflow: hidden;
  z-index: 5;

  &::before {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 388px;
    height: 428px;
    background: linear-gradient(
      0deg,
      #50a5e2,
      #50a5e2,
      #50a5e2,
      transparent,
      transparent
    );
    z-index: 1;
    animation: animate 6s linear infinite;
    transform-origin: top left;
  }

  &::after {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 388px;
    height: 428px;
    background: linear-gradient(
      0deg,
      #50a5e2,
      #50a5e2,
      #50a5e2,
      transparent,
      transparent
    );
    z-index: 1;
    animation: animate 6s linear infinite;
    transform-origin: top left;
    animation-delay: -3s;
  }

  @media screen and (min-width: 425px) {
    width: 388px;
    height: 428px;
  }
`;

const HtmlAnimationSpan = styled.form`
  position: absolute;
  top: 0;
  inset: 0;

  &::before {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 388px;
    height: 428px;
    background: linear-gradient(
      0deg,
      #f0ad05,
      #f0ad05,
      #f0ad05,
      transparent,
      transparent
    );
    z-index: 1;
    animation: animate 6s linear infinite;
    transform-origin: top left;
    animation-delay: -4.5s;
  }

  &::after {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 388px;
    height: 428px;
    background: linear-gradient(
      0deg,
      #f0ad05,
      #f0ad05,
      #f0ad05,
      transparent,
      transparent
    );
    z-index: 1;
    animation: animate 6s linear infinite;
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
  height: 420px;

  background-color: var(--color-primary);
  border-radius: 8px;
  padding: 30px 20px;

  & h1 {
    letter-spacing: 3px;
    margin: 0 0 -10px 0;
  }

  @media screen and (min-width: 425px) {
    flex-basis: 380px;
    height: 420px;
  }
`;

const HtmlInputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 45px;

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
`;

const HtmlInputField = styled.input`
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

  &:focus ~ span {
    color: var(--color-white);
    font-size: 12px;
    transform: translateY(-44px);
  }

  &:focus ~ i {
    height: 48px;
  }
`;

const EmailIcon = styled(TfiEmail)`
  margin-right: 10px;
`;

const LockIcon = styled(TfiLock)`
  margin-right: 10px;
`;

const LoginIcon = styled(MdOutlineLogin)`
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

const LoginPage = () => {
  console.log("render");
  return (
    <HtmlPageContainer>
      <HtmlFormContainer>
        <HtmlAnimationSpan />
        <HtmlLoginForm>
          <h1>Login</h1>
          <HtmlInputContainer>
            <HtmlInputField />
            <span>
              <EmailIcon />
              Email
            </span>
            <i></i>
          </HtmlInputContainer>
          <HtmlInputContainer>
            <HtmlInputField />
            <span>
              <LockIcon />
              Password
            </span>
            <i></i>
          </HtmlInputContainer>
          <Button
            color="var(--color-primary-dark)"
            hoverColor="var(--color-grey-dark)"
            backgroundColor="var(--color-white)"
            backgroundHoverColor="var(--color-grey-bright)"
            width="100%"
            height="40px"
            padding="9px 25px"
            margin="30px 0 0"
            spaceChildren="center"
            fontSize={16}
            borderRadious={4}
          >
            Login <LoginIcon />
          </Button>
          <HtmlRegisterContainer>
            Don't have an account?
            <HtmlRegisterLink to="/register">Register</HtmlRegisterLink>
          </HtmlRegisterContainer>
        </HtmlLoginForm>
      </HtmlFormContainer>
    </HtmlPageContainer>
  );
};

export default LoginPage;
