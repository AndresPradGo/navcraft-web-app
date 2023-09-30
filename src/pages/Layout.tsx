import { useState } from "react";
import { Outlet } from "react-router-dom";
import { styled } from "styled-components";

import NavBar from "../components/NavBar";
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

const Layout = () => {
  const [navBarIsExpanded, setNavBarIsExpanded] = useState(false);
  const [navBarLinks, setNavBarLinks] = useState([
    "flights",
    "waypoints",
    "aircraft",
    "users",
    "profile",
  ]);

  return (
    <HtmlLayoutContainer
      $numNavLinks={navBarLinks.length}
      $navBarIsExpanded={navBarIsExpanded}
    >
      <NavBar
        expanded={navBarIsExpanded}
        handleExpand={setNavBarIsExpanded}
        linksLinst={navBarLinks}
      />
      <Outlet />
    </HtmlLayoutContainer>
  );
};

export default Layout;
