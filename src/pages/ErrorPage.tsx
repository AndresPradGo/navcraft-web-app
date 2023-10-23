import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { TbHome } from "react-icons/tb";

import { styled } from "styled-components";

import Button from "../components/common/button";

const HtmlContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const HtmlTextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const HtmlTitle = styled.h1`
  color: var(--color-white);
  font-size: 24px;
  display: inline-block;
  border-right: 1px solid var(--color-white);
  padding-right: 23px;
  margin: 0 20px 0 0;
`;

const HtmlText = styled.p`
  display: inline-block;
  font-size: 16px;
  color: var(--color-white);
  text-align: center;
`;

const HomeIcon = styled(TbHome)`
  font-size: 20px;
`;

const ErrorPage = () => {
  const error = useRouteError();
  const pageNotFoundError =
    isRouteErrorResponse(error) || (error as Error).message === "notFound";
  const errorCode = pageNotFoundError ? "404" : "500";
  const errorMessage = pageNotFoundError
    ? "Page not found!"
    : "An unexpected error occurred! We're looking into it.";

  return (
    <HtmlContainer>
      <HtmlTextContainer>
        <HtmlTitle>{errorCode}</HtmlTitle>
        <HtmlText>{errorMessage}</HtmlText>
      </HtmlTextContainer>
      <Button
        href="/flights"
        color="var(--color-primary-dark)"
        hoverColor="var(--color-primary-dark)"
        backgroundColor="var(--color-contrast)"
        backgroundHoverColor="var(--color-contrast-hover)"
        shadow={true}
        spaceChildren="space-evenly"
        width="140px"
      >
        HOME PAGE
        <HomeIcon />
      </Button>
    </HtmlContainer>
  );
};

export default ErrorPage;
