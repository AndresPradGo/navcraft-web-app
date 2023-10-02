import { styled } from "styled-components";

import useSideBar from "./useSideBar";

interface HtmlSideBarContainerProps {
  $sideBarIsExpanded: boolean;
}

const HtmlSideBarContainer = styled.section<HtmlSideBarContainerProps>`
  transition: all 0.5s ease-out;
  overflow-x: hidden;
  grid-row: 2 / span 2;
  grid-column: 1 / span 1;
  width: ${(props) => (props.$sideBarIsExpanded ? "300px" : "0px")};
  height: 100%;

  @media screen and (min-width: 620px) {
    width: ${(props) => (props.$sideBarIsExpanded ? "300px" : "0px")};
  }

  @media screen and (min-width: 1280px) {
    grid-row: 1 / span 3;
    width: 300px;
  }
`;

const HtmlSideBar = styled.div`
  background-color: var(--color-primary);
  border-right: 2px solid var(--color-primary-light);
  height: 100%;
  width: 100%;
  transition: all 1s linear;
  padding: 100px 20px 0;
  display: flex;
  flex-direction: column;
`;

const SideBar = () => {
  const { sideBarIsExpanded } = useSideBar();
  return (
    <HtmlSideBarContainer $sideBarIsExpanded={sideBarIsExpanded}>
      <HtmlSideBar>SideBar</HtmlSideBar>
    </HtmlSideBarContainer>
  );
};

export default SideBar;
