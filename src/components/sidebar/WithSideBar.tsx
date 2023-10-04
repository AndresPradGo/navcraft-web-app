import { ReactNode } from "react";
import { styled } from "styled-components";

import useSideBar from "./useSideBar";
import SideBar from "./SideBar";

const HtmlSideBarAndContentContainer = styled.div`
  grid-row: 2;
  grid-column: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
`;

const HtmlMainContainer = styled.main`
  overflow: hidden;
  transition: all 0.5s ease-out;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

interface HtmlSideBarContainerProps {
  $sideBarIsExpanded: boolean;
}
const HtmlMainContainerWithSideBar = styled(
  HtmlMainContainer
)<HtmlSideBarContainerProps>`
  max-width: ${(props) => (props.$sideBarIsExpanded ? "0px" : "100vw")};
  transform: translate(
    ${(props) => (props.$sideBarIsExpanded ? "100vw" : "0")}
  );

  @media screen and (min-width: 635px) {
    max-width: ${(props) =>
      props.$sideBarIsExpanded ? "calc(100vw - 300px)" : "100vw"};
    transform: translate(0);
  }
`;

interface Props {
  children: ReactNode;
}

const WithSideBar = ({ children }: Props) => {
  const { hasSideBar, sideBarIsExpanded } = useSideBar();
  if (!hasSideBar)
    return (
      <HtmlSideBarAndContentContainer>
        <HtmlMainContainer>{children}</HtmlMainContainer>
      </HtmlSideBarAndContentContainer>
    );

  return (
    <HtmlSideBarAndContentContainer>
      <SideBar />
      <HtmlMainContainerWithSideBar $sideBarIsExpanded={sideBarIsExpanded}>
        {children}
      </HtmlMainContainerWithSideBar>
    </HtmlSideBarAndContentContainer>
  );
};

export default WithSideBar;
