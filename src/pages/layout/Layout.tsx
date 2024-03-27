import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { styled } from 'styled-components';

import NavBar from '../../components/navbar';
import { SideBarProvider } from '../../components/sidebar';
import useAuth from '../../hooks/useAuth';

const HtmlLayoutContainer = styled.div`
  transition: all 0.5s ease-out;
  overflow: hidden;
  display: grid;
  min-height: 100vh;
  max-width: 100vw;
  grid-template-rows: 61px 100fr;
  grid-template-columns: 100fr;

  @media screen and (min-width: 768px) {
    grid-template-rows: 71px 100fr;
  }
`;

const HtmlContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const HtmlTextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const HtmlText = styled.p`
  display: inline-block;
  font-size: 16px;
  color: var(--color-white);
  text-align: center;
`;

const Layout = () => {
  const user = useAuth();
  if (!user) return <Navigate to="/login" />;

  const [screenTooSmall, setScreenTooSmall] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth < 375) {
        setScreenTooSmall(true);
      } else setScreenTooSmall(false);
    };

    checkScreenWidth();

    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  if (screenTooSmall) {
    return (
      <HtmlContainer>
        <HtmlTextContainer>
          <HtmlText>
            The NavCraft Web-App doesn't work properly on screens smaller than
            375px. Consider using a bigger device, or resize your browser
            accordingly.
          </HtmlText>
        </HtmlTextContainer>
      </HtmlContainer>
    );
  }

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
