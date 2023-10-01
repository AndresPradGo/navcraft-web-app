import { ReactElement } from "react";

import { MdOutlineLogout } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";

import NavBarExpandButton from "./NavBarExpandButton";
import Button from "./common/Button";
import SideBarExpandButton from "./SideBarExpandButton";

const HtmlNavBarContainer = styled.div`
  display: flex;
  overflow-y: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 100vw;
  grid-area: header;
  background-color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary-light);

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
  grid-area: header;
  background-color: var(--color-primary);

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
  background-color: var(--color-primary);
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
    background-color: var(--color-primary);

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

const HtmlLogoutButtonLogo = styled(MdOutlineLogout)`
  font-size: 18px;
  margin-left: 5px;
`;

interface NavLinkDataType {
  text: string;
  href: string;
  icon: ReactElement;
}
interface Props {
  expanded: boolean;
  handleExpand: (expandNavBar: boolean) => void;
  linksLinst: NavLinkDataType[];
}

const NavBar = ({ expanded, handleExpand, linksLinst }: Props) => {
  const logoutButtonProps = {
    color: "var(--color-grey)",
    hoverColor: "var(--color-neutral)",
    backgroundColor: "var(--color-grey)",
    backgroundHoverColor: "var(--color-neutral)",
    fill: false,
    scale: 1,
    margin: "0px",
    children: ["Logout", <HtmlLogoutButtonLogo key="logoutButtonIcon" />],
  };

  return (
    <HtmlNavBarContainer>
      <HtmlNavbar>
        <HtmlNavBarGroup $expanded={expanded}>
          <SideBarExpandButton />
          <Button
            color={logoutButtonProps.color}
            hoverColor={logoutButtonProps.hoverColor}
            backgroundColor={logoutButtonProps.backgroundColor}
            backgroundHoverColor={logoutButtonProps.backgroundHoverColor}
            fill={logoutButtonProps.fill}
            scale={logoutButtonProps.scale}
            margin={logoutButtonProps.margin}
            children={logoutButtonProps.children}
          />
          <NavBarExpandButton
            isExpanded={expanded}
            handleClick={handleExpand}
          />
        </HtmlNavBarGroup>
        <HtmlNavLinkContainer>
          {linksLinst.map((link) => (
            <HtmlNavLink
              key={link.href}
              to={link.href}
              onClick={() => handleExpand(false)}
            >
              {link.icon}
              <HtmlLinkText>{link.text}</HtmlLinkText>
            </HtmlNavLink>
          ))}
        </HtmlNavLinkContainer>
        <div>
          <SideBarExpandButton />
        </div>
      </HtmlNavbar>
    </HtmlNavBarContainer>
  );
};

export default NavBar;
