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
  max-width: 1280px;
`;

const HtmlTitleSection = styled.section`
  max-height: 70px;
  color: var(--color-highlight);
`;

const HtmlBodySection = styled.section``;

const HtmlLinkText = styled.span`
  margin: 0 10px;
  font-size: 16px;
  @media screen and (min-width: 768px) {
    margin-left: 0px;
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
          <HtmlLinkText>{titleText}</HtmlLinkText>
        </HtmlTitleSection>
        <Outlet />
        <HtmlBodySection>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
            tenetur earum optio sit accusantium voluptas et deleniti dolores a
            expedita aut facere modi quas, explicabo deserunt eum vero delectus
            accusamus cumque id placeat. Dolore ratione explicabo nam. Odit
            atque voluptatum veritatis quas adipisci facere, debitis, quidem
            alias harum, dolor aperiam.
          </p>
        </HtmlBodySection>
      </HtmlMainContent>
    </HtmlMainContainer>
  );
};

export default ContentSection;
