import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { styled } from "styled-components";

import NavBar from "../components/NavBar";
import useNavLinks from "../hooks/useNavLinks";
import SideBarContext from "../contexts/sideBarContext";
import usePathData from "../hooks/usePathData";
interface HtmlLayoutContainerProps {
  $numNavLinks: number;
  $navBarIsExpanded: boolean;
}

const HtmlLayoutContainer = styled.div<HtmlLayoutContainerProps>`
  transition: all 0.5s ease-out;
  overflow: hidden;
  display: grid;
  min-height: 100vh;
  width: 100vw;
  grid-template-rows: ${(props) =>
      props.$navBarIsExpanded ? props.$numNavLinks * 50 + 64 : 62}px auto 100px;
  grid-template-columns: 100%;
  grid-template-areas:
    "header"
    "main"
    "footer";

  @media screen and (min-width: 768px) {
    grid-template-rows: 72px auto 100px;
  }
`;

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

const Layout = () => {
  const navBarLinks = useNavLinks(true);
  const pathData = usePathData(navBarLinks);

  if (!pathData) return <Navigate to="/flights" />;

  const [sideBarIsExpanded, setSideBarIsExpanded] = useState(false);
  const [navBarIsExpanded, setNavBarIsExpanded] = useState(false);

  const TitleIconComponent = pathData.titleData.titleIcon;

  return (
    <SideBarContext.Provider
      value={{ sideBarIsExpanded, setSideBarIsExpanded }}
    >
      <HtmlLayoutContainer
        $numNavLinks={navBarLinks.length}
        $navBarIsExpanded={navBarIsExpanded}
      >
        <NavBar
          expanded={navBarIsExpanded}
          handleExpand={setNavBarIsExpanded}
          linksLinst={navBarLinks}
        />
        <HtmlMainContainer>
          <HtmlMainContent>
            <HtmlTitleSection>
              <TitleIconComponent />
              <HtmlTitleText>{pathData.titleData.titleText}</HtmlTitleText>
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
