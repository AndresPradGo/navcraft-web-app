import { useState } from "react";
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
      props.$navBarIsExpanded ? props.$numNavLinks * 50 + 52 : 52}px auto 100px;
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
    "profile",
    "users",
  ]);

  const handlExpandNavBar = () => {
    setNavBarIsExpanded(!navBarIsExpanded);
  };

  return (
    <HtmlLayoutContainer
      $numNavLinks={navBarLinks.length}
      $navBarIsExpanded={navBarIsExpanded}
    >
      <NavBar
        expanded={navBarIsExpanded}
        handleExpand={handlExpandNavBar}
        linksLinst={navBarLinks}
      />
    </HtmlLayoutContainer>
  );
};

export default Layout;
