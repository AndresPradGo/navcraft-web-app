import { useState } from "react";
import { styled } from "styled-components";

interface HtmlLayoutContainerProps {
  $numNavLinks: number;
}

const HtmlLayoutContainer = styled.div<HtmlLayoutContainerProps>`
  transition: all 0.5s ease-out;
  overflow-x: hidden;
  display: grid;
  min-height: 100vh;
  width: 100vw;
  grid-template-rows: ${(props) => props.$numNavLinks * 30 + 30}px auto 100px;
  grid-template-columns: 100%;
  grid-template-areas:
    "header"
    "main"
    "footer";
`;

const Layout = () => {
  const [navBarLinks, setNavBarLinks] = useState([]);
  return (
    <HtmlLayoutContainer $numNavLinks={navBarLinks.length}>
      Layout
    </HtmlLayoutContainer>
  );
};

export default Layout;
