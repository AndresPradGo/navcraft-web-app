import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { styled } from "styled-components";

import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import useNavLinks from "../hooks/useNavLinks";
import SideBarContext from "../contexts/sideBarContext";
import usePathData from "../hooks/usePathData";
interface HtmlLayoutContainerProps {
  $numNavLinks: number;
  $navBarIsExpanded: boolean;
  $sideBarIsExpanded: boolean;
}

const HtmlLayoutContainer = styled.div<HtmlLayoutContainerProps>`
  transition: all 0.5s ease-out;
  overflow: hidden;
  display: grid;
  min-height: 100vh;
  width: 100vw;
  grid-template-rows: ${(props) =>
      props.$navBarIsExpanded ? props.$numNavLinks * 50 + 64 : 62}px auto 100px;
  grid-template-columns: ${(props) =>
    props.$sideBarIsExpanded ? "100fr 0px" : "0px 100fr"};

  @media screen and (min-width: 768px) {
    grid-template-rows: 72px auto 100px;
  }
`;

interface HtmlSideBarContainerProps {
  $sideBarIsExpanded: boolean;
}

const HtmlSideBarContainer = styled.section<HtmlSideBarContainerProps>`
  transition: all 0.5s ease-out;
  overflow-x: hidden;
  grid-row: 2 / span 2;
  grid-column: 1 / span 1;
  width: ${(props) => (props.$sideBarIsExpanded ? "300px" : "0px")};

  @media screen and (min-width: 620px) {
    width: ${(props) => (props.$sideBarIsExpanded ? "300px" : "0px")};
  }

  @media screen and (min-width: 1280px) {
    grid-row: 1 / span 3;
    width: 300px;
  }
`;

const HtmlMainContainer = styled.main<HtmlSideBarContainerProps>`
  transform: translate(${(props) => (props.$sideBarIsExpanded ? "200%" : "0")});
  transition: all 0.5s ease-out;
  grid-row: 2;
  grid-column: 2;
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

const Layout = () => {
  const navBarLinks = useNavLinks(true);
  const { titleData, hasSideBar } = usePathData(navBarLinks);
  if (!titleData) return <Navigate to="/flights" />;

  const [sideBarIsExpanded, setSideBarIsExpanded] = useState(false);
  const [navBarIsExpanded, setNavBarIsExpanded] = useState(false);

  console.log(navBarIsExpanded);

  const TitleIconComponent = titleData.titleIcon;

  return (
    <SideBarContext.Provider
      value={{
        hasSideBar,
        sideBarIsExpanded,
        setSideBarIsExpanded,
      }}
    >
      <HtmlLayoutContainer
        $numNavLinks={navBarLinks.length}
        $navBarIsExpanded={navBarIsExpanded}
        $sideBarIsExpanded={hasSideBar && sideBarIsExpanded}
      >
        <NavBar
          expanded={navBarIsExpanded}
          handleExpand={setNavBarIsExpanded}
          linksLinst={navBarLinks}
        />
        <HtmlSideBarContainer
          $sideBarIsExpanded={hasSideBar && sideBarIsExpanded}
        >
          <SideBar />
        </HtmlSideBarContainer>
        <HtmlMainContainer $sideBarIsExpanded={hasSideBar && sideBarIsExpanded}>
          <HtmlMainContent>
            <HtmlTitleSection>
              <TitleIconComponent />
              <HtmlTitleText>{titleData.titleText}</HtmlTitleText>
            </HtmlTitleSection>
            <HtmlBodySection>
              <Outlet />
            </HtmlBodySection>
          </HtmlMainContent>
        </HtmlMainContainer>
      </HtmlLayoutContainer>
    </SideBarContext.Provider>
  );
};

export default Layout;
