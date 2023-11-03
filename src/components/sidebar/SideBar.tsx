import { styled } from "styled-components";

import useSideBar from "./useSideBar";
import { ReactNode } from "react";

interface HtmlSideBarContainerProps {
  $sideBarIsExpanded: boolean;
}

const HtmlSideBar = styled.div<HtmlSideBarContainerProps>`
  z-index: 99;
  min-height: 100%;
  background-color: var(--color-primary-dark);
  transition: all 0.2s ease-out;
  overflow-x: hidden;
  width: ${(props) => (props.$sideBarIsExpanded ? "95%" : "0px")};
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-shrink: 0;

  @media screen and (min-width: 635px) {
    width: ${(props) => (props.$sideBarIsExpanded ? "315px" : "0px")};
  }

  @media screen and (min-width: 1280px) {
    width: 350px;
  }
`;

const HtmlWraper = styled.div<HtmlSideBarContainerProps>`
  z-index: 99;
  transition: all 0.2s ease-out;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  max-height: 100vh;
  width: ${(props) => (props.$sideBarIsExpanded ? "95%" : "0px")};

  @media screen and (min-width: 635px) {
    width: ${(props) => (props.$sideBarIsExpanded ? "315px" : "0px")};
  }

  @media screen and (min-width: 1280px) {
    width: 350px;
  }
`;

const HtmlHeaderDiv = styled.div`
  width: 100%;
  background-color: var(--color-primary);
  flex-shrink: 0;
  height: 61px;

  @media screen and (min-width: 768px) {
    height: 71px;
  }
`;

const HtmlContent = styled.div`
  width: 100%;
  padding: 0 calc((100% - 315px) * 0.5);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media screen and (min-width: 635px) {
    padding: 0;
  }
`;

const HtmlFooterDiv = styled.div`
  width: 100%;
  height: 1px;
`;

interface Props {
  children: ReactNode;
}

const SideBar = ({ children }: Props) => {
  const { sideBarIsExpanded } = useSideBar();
  return (
    <HtmlSideBar $sideBarIsExpanded={sideBarIsExpanded}>
      <HtmlWraper $sideBarIsExpanded={sideBarIsExpanded}>
        <HtmlHeaderDiv />
        <HtmlContent>{children}</HtmlContent>
        <HtmlFooterDiv />
      </HtmlWraper>
    </HtmlSideBar>
  );
};

export default SideBar;
