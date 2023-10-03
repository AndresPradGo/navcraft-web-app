import { styled } from "styled-components";

import useSideBar from "./useSideBar";

interface HtmlSideBarContainerProps {
  $sideBarIsExpanded: boolean;
}

const HtmlSideBar = styled.div<HtmlSideBarContainerProps>`
  background-color: var(--color-primary-dark);
  transition: all 0.5s ease-out;
  overflow-x: hidden;
  width: ${(props) => (props.$sideBarIsExpanded ? "300px" : "0px")};
  height: 100%;
  padding: ${(props) => (props.$sideBarIsExpanded ? "40px 20px 0" : "40px 0")};
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 620px) {
    width: ${(props) => (props.$sideBarIsExpanded ? "300px" : "0px")};
  }

  @media screen and (min-width: 1280px) {
    padding: 40px 20px 0;
    width: 300px;
  }
`;

const SideBar = () => {
  const { sideBarIsExpanded } = useSideBar();
  return (
    <HtmlSideBar $sideBarIsExpanded={sideBarIsExpanded}>SideBar</HtmlSideBar>
  );
};

export default SideBar;
