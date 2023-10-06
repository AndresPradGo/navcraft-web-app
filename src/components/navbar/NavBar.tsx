import { useState } from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";

import NavBarExpandButton from "./NavBarExpandButton";
import { SideBarExpandButton } from "../sidebar";
import { useSideBar } from "../sidebar";
import useNavLinks from "./useNavLinks";
import { usePathList } from "../../router";

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
  max-height: ${(props) => (props.$expanded ? "100vh" : "61px")};

  border-bottom: 1px solid var(--color-grey-dark);

  background-color: var(--color-primary-dark);
  opacity: 0.93;

  @media screen and (min-width: 768px) {
    max-height: 72px;
    flex-direction: row;
  }
`;

const HtmlNavbar = styled.div`
  display: flex;
  overflow-y: hidden;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100vw;
  background-color: transparent;

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
      width: 80px;
      padding: 5px 20px;
    }
  }

  @media screen and (min-width: 768px) {
    max-height: 72px;
    max-width: 1400px;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;

    & div:last-of-type {
      width: 40px;
      padding: 0px;
      margin-left: calc(5vw - 10px);
    }
  }
`;

interface HtmlNavbarProps {
  $expanded: boolean;
}

const HtmlNavBarGroup = styled.div<HtmlNavbarProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 100vw;
  min-height: 61px;
  padding: 5px 10px;

  border-bottom: ${(props) =>
    props.$expanded ? "1px solid var(--color-grey-dark)" : "0px"};

  & div:first-of-type {
    min-width: 40px;
    min-height: 40px;
  }

  @media screen and (min-width: 425px) {
    padding: 5px 20px;
  }

  @media screen and (min-width: 768px) {
    min-width: 0px;
    width: 40px;
    border-bottom: 0px;
    padding: 0px;
    margin-left: calc(5vw - 10px);

    & * {
      display: none;
    }
  }

  @media screen and (min-width: 1024px) {
    padding: 5px 20px 5px 0px;
  }
`;

const HtmlNavLinkContainer = styled.div<HtmlNavbarProps>`
  min-width: 100%;

  background-color: var(--color-primary-dark);
  opacity: 1;

  & .active {
    color: var(--color-white) !important;
  }

  @media screen and (min-width: 768px) {
    min-width: 0px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    & .active {
      color: var(--color-primary-dark) !important;
      background-color: var(--color-white) !important;
    }
    & .active:hover,
    & .active:focus {
      color: var(--color-primary-dark) !important;
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
  background-color: transparent;
  cursor: pointer;

  &:hover,
  &:focus {
    color: var(--color-white);
    background-color: transparent;
  }

  @media screen and (min-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 110px;
    height: 70px;
    padding: 5px 10px;

    color: var(--color-grey);
    background-color: transparent;

    &:hover,
    &:focus {
      color: var(--color-white);
    }
  }

  @media screen and (min-width: 1024px) {
    min-width: 170px;
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  color: var(--color-highlight);

  @media screen and (min-width: 768px) {
    overflow: hidden;
    max-height: 0;
    max-width: 0;
    display: none;
  }
`;

const NavBar = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const linksList = useNavLinks(false);
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
          {hasSideBar ? <SideBarExpandButton /> : <div></div>}
          <HtmlTitle>
            <ActiveLinkIcon />
            <HtmlLinkText>{activeLinkData.text}</HtmlLinkText>
          </HtmlTitle>
          <NavBarExpandButton isExpanded={expanded} handleClick={setExpanded} />
        </HtmlNavBarGroup>
        <HtmlNavLinkContainer $expanded={expanded}>
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
