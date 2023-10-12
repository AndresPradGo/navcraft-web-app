import { styled } from "styled-components";

import useSideBar from "./useSideBar";
import { ReactNode } from "react";

interface HtmlSideBarContainerProps {
  $sideBarIsExpanded: boolean;
}

const HtmlSideBar = styled.div<HtmlSideBarContainerProps>`
  min-height: 100%;
  background-color: var(--color-primary-dark);
  border-right: 1px solid var(--color-grey-dark);
  transition: all 0.2s ease-out;
  overflow-x: hidden;
  width: ${(props) => (props.$sideBarIsExpanded ? "300px" : "0px")};
  padding: 61px 0 0;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 620px) {
    width: ${(props) => (props.$sideBarIsExpanded ? "300px" : "0px")};
  }

  @media screen and (min-width: 768px) {
    padding: 71px 0 0;
  }

  @media screen and (min-width: 1280px) {
    width: 300px;
  }
`;

interface Props {
  children: ReactNode;
}

const SideBar = ({ children }: Props) => {
  const { sideBarIsExpanded } = useSideBar();
  return (
    <HtmlSideBar $sideBarIsExpanded={sideBarIsExpanded}>{children}</HtmlSideBar>
  );
};

export default SideBar;
