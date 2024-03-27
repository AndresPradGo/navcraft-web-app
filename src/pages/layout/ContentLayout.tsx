import { ReactNode, useState, useEffect } from 'react';
import { styled } from 'styled-components';
import WithSideBar from '../../components/sidebar/WithSideBar';

interface MapProps {
  $mapIsOpen: boolean;
}
const HtmlMapContainer = styled.div<MapProps>`
  background-color: var(--color-grey-bright);
  transition: all 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: calc(100vh - 61px);
  overflow: hidden;
  padding: 0;

  max-width: ${(props) => (props.$mapIsOpen ? '200vw' : '0')};
  transform: ${(props) => (props.$mapIsOpen ? 'none' : 'translate(-100vw)')};

  @media screen and (min-width: 768px) {
    height: calc(100vh - 71px);
  }
`;

const HtmlMainContainer = styled.div<MapProps>`
  transition:
    transform 0.5s,
    max-width 0.5s,
    padding 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  overflow: hidden;

  padding: ${(props) => (!props.$mapIsOpen ? '10px 3%' : '10px 0')};
  max-width: ${(props) => (!props.$mapIsOpen ? '1380px' : '0')};
  max-height: ${(props) =>
    !props.$mapIsOpen ? '300000vh' : 'calc(100vh - 61px)'};
  transform: ${(props) => (!props.$mapIsOpen ? 'none' : 'translate(100vw)')};

  @media screen and (min-width: 425px) {
    padding: ${(props) => (!props.$mapIsOpen ? '20px 3%' : '20px 0')};
  }

  @media screen and (min-width: 768px) {
    padding: ${(props) => (!props.$mapIsOpen ? '40px 3%' : '40px 0')};
    max-height: ${(props) =>
      !props.$mapIsOpen ? '300000vh' : 'calc(100vh - 71px)'};
  }

  @media screen and (min-width: 1000px) {
    padding: ${(props) => (!props.$mapIsOpen ? '40px 30px' : '40px 0')};
  }
`;

interface Props {
  children: ReactNode;
  sideBarContent?: ReactNode;
  map?: {
    isOpen: boolean;
    component: ReactNode;
  };
}

const ContentLayout = ({ children, sideBarContent, map }: Props) => {
  const [renderMap, setRenderMap] = useState(false);

  useEffect(() => {
    let timeOut = setTimeout(() => {}, 0);
    if (map) {
      if (!map.isOpen) {
        timeOut = setTimeout(() => {
          setRenderMap(false);
        }, 100);
      } else setRenderMap(true);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [map?.isOpen]);

  if (!map) {
    return (
      <WithSideBar sideBarContent={sideBarContent ? sideBarContent : ''}>
        <HtmlMainContainer $mapIsOpen={false}>{children}</HtmlMainContainer>
      </WithSideBar>
    );
  }

  return (
    <WithSideBar sideBarContent={sideBarContent ? sideBarContent : ''}>
      <HtmlMapContainer $mapIsOpen={renderMap}>
        {renderMap ? map.component : null}
      </HtmlMapContainer>
      <HtmlMainContainer $mapIsOpen={renderMap}>{children}</HtmlMainContainer>
    </WithSideBar>
  );
};

export default ContentLayout;
