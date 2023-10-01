import { ReactElement } from "react";
import { styled } from "styled-components";
import { Outlet } from "react-router-dom";

const HtmlMainContainer = styled.main`
  grid-area: main;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
`;

const HtmlMainContent = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  max-width: 1280px;
`;

const HtmlTitleSection = styled.section`
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  color: var(--color-neutral);
  padding: 40px 10px 0px;
  font-size: 36px;

  @media screen and (min-width: 768px) {
    padding: 0px;
    max-width: 0px;
    max-height: 0px;
    diosplay: none;
  }
`;

const HtmlTitleText = styled.span`
  margin: 0 10px;
  font-size: 26px;
  @media screen and (min-width: 768px) {
    margin: 0px;
    font-size: 0px;
  }
`;

const HtmlBodySection = styled.section`
  width: 100%;
  height: 100%;
  padding: 40px 3%;

  @media screen and (min-width: 533px) {
    padding: 40px 16px;
  }

  @media screen and (min-width: 1280px) {
    padding: 40px calc(16px - (100vw - 1280px) * 0.5);
  }

  @media screen and (min-width: 1312px) {
    padding: 40px 0px;
  }
`;

interface Props {
  titleText: string;
  titleIcon: ReactElement;
}

const ContentSection = ({ titleText, titleIcon }: Props) => {
  return (
    <HtmlMainContainer>
      <HtmlMainContent>
        <HtmlTitleSection>
          {titleIcon}
          <HtmlTitleText>{titleText}</HtmlTitleText>
        </HtmlTitleSection>
        <HtmlBodySection>
          <Outlet />
        </HtmlBodySection>
      </HtmlMainContent>
    </HtmlMainContainer>
  );
};

export default ContentSection;
