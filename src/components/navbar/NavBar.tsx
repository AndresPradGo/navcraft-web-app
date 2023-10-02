import { useState } from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";

import NavBarExpandButton from "./NavBarExpandButton";
import { SideBarExpandButton } from "../sidebar";
import { useSideBar } from "../sidebar";
import useNavLinks from "./useNavLinks";
import usePathList from "../../hooks/usePathList";

interface HtmlNavBarContainerProps {
  $expanded: boolean;
}
const HtmlNavBarContainer = styled.div<HtmlNavBarContainerProps>`
  transition: all 0.2s linear;
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  overflow-y: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 100vw;
  max-height: ${(props) => (props.$expanded ? "100vh" : "60px")};

  background-color: var(--color-primary-dark);

  @media screen and (min-width: 768px) {
    max-height: 72px;
    flex-direction: row;
  }
`;

interface HtmlNavbarProps {
  $expanded: boolean;
}
const HtmlNavbar = styled.div`
  display: flex;
  overflow-y: hidden;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100vw;
  background-color: var(--color-primary-dark);

  & div:last-of-type {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  @media screen and (min-width: 768px) {
    max-height: 72px;
    max-width: 1400px;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    & div:last-of-type {
      min-width: 105.703px;
    }
  }

  @media screen and (min-width: 1024px) {
    & div:last-of-type {
      min-width: 115.703px;
    }
  }
`;

const HtmlNavBarGroup = styled.div<HtmlNavbarProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 100vw;
  min-height: ${(props) => (props.$expanded ? "62px" : "60px")};
  padding: 5px 10px;

  border-bottom: ${(props) =>
    props.$expanded ? "2px solid var(--color-primary-light)" : "0px"};

  @media screen and (min-width: 425px) {
    padding: 5px 20px;
  }

  @media screen and (min-width: 768px) {
    min-width: 0px;
    border-bottom: 0px;
    padding: 5px 10px 5px 0px;
  }

  @media screen and (min-width: 1024px) {
    padding: 5px 20px 5px 0px;
  }
`;

const HtmlNavLinkContainer = styled.div`
  min-width: 100%;

  & .active {
    color: var(--color-neutral) !important;
    pointer-events: none !important;
    cursor: none !important;
  }

  @media screen and (min-width: 768px) {
    min-width: 0px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    & .active {
      color: var(--color-primary) !important;
      background-color: var(--color-neutral) !important;
    }
    & .active:hover,
    & .active:focus {
      color: var(--color-primary) !important;
    }
  }
`;

const HtmlNavLink = styled(NavLink)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  min-width: 100%;
  min-height: 50px;
  padding: 5px 20px;
  font-size: 26px;
  border-radius: 5px;

  transition: all 0.2s linear;
  color: var(--color-grey);
  background-color: var(--color-primary-dark);
  cursor: pointer;

  &:hover,
  &:focus {
    color: var(--color-neutral);
  }

  @media screen and (min-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 0px;
    height: 70px;
    padding: 5px 20px;

    color: var(--color-grey);
    background-color: var(--color-primary-dark);

    &:hover,
    &:focus {
      color: var(--color-neutral);
    }
  }

  @media screen and (min-width: 1024px) {
    padding: 5px 40px;
  }
`;

const HtmlLinkText = styled.span`
  margin: 0 10px;
  font-size: 16px;
  @media screen and (min-width: 768px) {
    margin-left: 0px;
  }
`;

const HtmlTitle = styled.div`
  @media screen and (min-width: 768px) {
    overflow: hidden;
    max-height: 0;
    max-width: 0;
    display: none;
  }
`;

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);
  const linksList = useNavLinks(true);
  const { hasSideBar, setSideBarIsExpanded } = useSideBar();

  let currentPath = usePathList();
  let activeLinkDataList = linksList.filter(
    (item) => item.href === `/${currentPath[0]}`
  );
  if (!activeLinkDataList.length)
    activeLinkDataList = linksList.filter((item) => item.href === "/flights");
  const activeLinkData = activeLinkDataList[0];
  const ActiveLinkIcon = activeLinkData.icon;

  const handleLinkClick = () => {
    setExpanded(false);
    setSideBarIsExpanded(false);
  };

  return (
    <HtmlNavBarContainer $expanded={expanded}>
      <HtmlNavbar>
        <HtmlNavBarGroup $expanded={expanded}>
          {hasSideBar ? <SideBarExpandButton /> : <></>}
          <HtmlTitle>
            <ActiveLinkIcon />
            <HtmlLinkText>{activeLinkData.text}</HtmlLinkText>
          </HtmlTitle>
          <NavBarExpandButton isExpanded={expanded} handleClick={setExpanded} />
        </HtmlNavBarGroup>
        <HtmlNavLinkContainer>
          {linksList.map((link) => {
            const IconComponent = link.icon;
            return (
              <HtmlNavLink
                key={link.href}
                to={link.href}
                onClick={handleLinkClick}
              >
                <IconComponent />
                <HtmlLinkText>{link.text}</HtmlLinkText>
              </HtmlNavLink>
            );
          })}
        </HtmlNavLinkContainer>
        <div>{hasSideBar ? <SideBarExpandButton /> : <></>}</div>
      </HtmlNavbar>
    </HtmlNavBarContainer>
  );
};

export default NavBar;
