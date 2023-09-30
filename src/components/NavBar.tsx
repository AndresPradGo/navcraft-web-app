import { ReactElement } from "react";
import { FaMapLocationDot, FaUserGear, FaUsersGear } from "react-icons/fa6";
import {
  MdFlightTakeoff,
  MdAirplanemodeActive,
  MdOutlineLogout,
} from "react-icons/md";
import { useLocation, Link } from "react-router-dom";
import { styled } from "styled-components";

import NavBarExpandButton from "./NavBarExpandButton";
import Button from "./common/button";

interface HtmlNavbarProps {
  $expanded: boolean;
}
const HtmlNavbar = styled.div<HtmlNavbarProps>`
  display: flex;
  overflow-y: hidden;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 100vw;
  grid-area: header;
  background-color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary-light);

  @media screen and (min-width: 768px) {
    max-height: 72px;
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

  @media screen and (min-width: 1440px) {
    & div:last-of-type {
      min-width: 135.703px;
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

  @media screen and (min-width: 1440px) {
    padding: 5px 40px 5px 0px;
  }
`;

const HtmlNavLinkContainer = styled.div`
  min-width: 100%;

  @media screen and (min-width: 768px) {
    min-width: 0px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
`;

interface HtmlNavLinkProps {
  $active: boolean;
}

const HtmlNavLink = styled(Link)<HtmlNavLinkProps>`
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
  color: ${(props) =>
    props.$active ? "var(--color-neutral)" : "var(--color-grey)"};
  background-color: "var(--color-primary)";

  pointer-events: ${(props) => (props.$active ? "none" : "auto")};
  cursor: ${(props) => (props.$active ? "none" : "pointer")};

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

    color: ${(props) =>
      props.$active ? "var(--color-primary)" : "var(--color-grey)"};
    background-color: ${(props) =>
      props.$active ? "var(--color-neutral)" : "var(--color-primary)"};

    &:hover,
    &:focus {
      color: ${(props) =>
        props.$active ? "var(--color-primary)" : "var(--color-neutral)"};
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

interface Props {
  expanded: boolean;
  handleExpand: (expandNavBar: boolean) => void;
  linksLinst: string[];
}

interface LinkDataSelector {
  flights: string;
  waypoints: string;
  aircraft: string;
  profile: string;
  users: string;
}

interface LinkIconSelector {
  flights: ReactElement;
  waypoints: ReactElement;
  aircraft: ReactElement;
  profile: ReactElement;
  users: ReactElement;
}

interface LinksDataType {
  path: LinkDataSelector;
  text: LinkDataSelector;
  href: LinkDataSelector;
  icon: LinkIconSelector;
}
const NavBar = ({ expanded, handleExpand, linksLinst }: Props) => {
  const { pathname } = useLocation();
  const path = pathname.split("/").filter((item) => item);

  const linksData: LinksDataType = {
    path: {
      flights: "flights",
      waypoints: "waypoints",
      aircraft: "aircraft-list",
      profile: "profile",
      users: "users",
    },
    text: {
      flights: "Flights",
      waypoints: "Waypoints",
      aircraft: "Aircraft",
      profile: "Profile",
      users: "Users",
    },
    href: {
      flights: "/flights",
      waypoints: "/waypoints",
      aircraft: "/aircraft-list",
      profile: "/profile",
      users: "/users",
    },
    icon: {
      flights: <MdFlightTakeoff />,
      waypoints: <FaMapLocationDot />,
      aircraft: <MdAirplanemodeActive />,
      profile: <FaUserGear />,
      users: <FaUsersGear />,
    },
  };

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
    <HtmlNavbar $expanded={expanded}>
      <HtmlNavBarGroup $expanded={expanded}>
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
        <NavBarExpandButton isExpanded={expanded} handleClick={handleExpand} />
      </HtmlNavBarGroup>
      <HtmlNavLinkContainer>
        {linksLinst.map((link) => (
          <HtmlNavLink
            key={link}
            to={linksData["href"][link as keyof LinkDataSelector]}
            $active={
              (!path.length && link === "flights") ||
              (path.length === 1 &&
                path[0] === linksData.path[link as keyof LinkDataSelector])
            }
            onClick={() => handleExpand(false)}
          >
            {linksData["icon"][link as keyof LinkIconSelector]}
            <HtmlLinkText>
              {linksData["text"][link as keyof LinkDataSelector]}
            </HtmlLinkText>
          </HtmlNavLink>
        ))}
      </HtmlNavLinkContainer>
      <div />
    </HtmlNavbar>
  );
};

export default NavBar;
