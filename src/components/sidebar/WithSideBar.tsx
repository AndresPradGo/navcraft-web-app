import { ReactNode } from 'react';
import { styled } from 'styled-components';

import useSideBar from './useSideBar';
import SideBar from './SideBar';

const HtmlSideBarAndContentContainer = styled.div`
  grid-row: 1 / spans 2;
  grid-column: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  width: 100%;
  min-height: 100vh;
`;

const HtmlMainContainer = styled.main`
  overflow: hidden;
  transition: all 0.2s ease-out;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  padding: 61px 0 0;

  @media screen and (min-width: 768px) {
    padding: 71px 0 0;
  }
`;

interface HtmlSideBarContainerProps {
  $sideBarIsExpanded: boolean;
}
const HtmlMainContainerWithSideBar = styled(
  HtmlMainContainer,
)<HtmlSideBarContainerProps>`
  max-width: ${(props) => (props.$sideBarIsExpanded ? '0px' : '100vw')};

  transform: ${(props) =>
    props.$sideBarIsExpanded ? 'translate(100vw)' : 'none'};

  @media screen and (min-width: 635px) {
    max-width: ${(props) =>
      props.$sideBarIsExpanded ? 'calc(100vw - 315px)' : 'calc(100vw)'};
    transform: none;
  }
`;

interface Props {
  children: ReactNode;
  sideBarContent: ReactNode;
}

const WithSideBar = ({ children, sideBarContent }: Props) => {
  const { hasSideBar, sideBarIsExpanded } = useSideBar();
  if (!hasSideBar)
    return (
      <HtmlSideBarAndContentContainer>
        <HtmlMainContainer>{children}</HtmlMainContainer>
      </HtmlSideBarAndContentContainer>
    );

  return (
    <HtmlSideBarAndContentContainer>
      <SideBar>{sideBarContent}</SideBar>
      <HtmlMainContainerWithSideBar $sideBarIsExpanded={sideBarIsExpanded}>
        {children}
      </HtmlMainContainerWithSideBar>
    </HtmlSideBarAndContentContainer>
  );
};

export default WithSideBar;
