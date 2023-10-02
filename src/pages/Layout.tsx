import { Outlet } from "react-router-dom";
import { styled } from "styled-components";

import { NavBar } from "../components/navbar";
import { SideBarProvider } from "../components/sidebar";

const HtmlLayoutContainer = styled.div`
  transition: all 0.5s ease-out;
  overflow: hidden;
  display: grid;
  min-height: 100vh;
  width: 100vw;
  grid-template-rows: 62px 100fr;
  grid-template-columns: 100fr;

  @media screen and (min-width: 768px) {
    grid-template-rows: 72px 100fr;
  }
`;

const Layout = () => {
  return (
    <SideBarProvider>
      <HtmlLayoutContainer>
        <NavBar />
        <Outlet />
      </HtmlLayoutContainer>
    </SideBarProvider>
  );
};

export default Layout;
