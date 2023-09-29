import { ReactElement } from "react";
import { MdFlightTakeoff, MdAirplanemodeActive } from "react-icons/md";
import { FaMapLocationDot, FaUserGear, FaUsersGear } from "react-icons/fa6";
import { useLocation, Link } from "react-router-dom";
import { styled } from "styled-components";
import NavBarExpandButton from "./NavBarExpandButton";

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
  }
`;

const HtmlNavBarGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  min-width: 100vw;
  padding: 5px;

  @media screen and (min-width: 768px) {
    min-width: 0px;
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
    props.$active ? "var(--color-highlight)" : "var(--color-grey)"};
  background-color: ${(props) =>
    props.$active ? "var(--color-primary)" : "var(--color-primary)"};

  pointer-events: ${(props) => (props.$active ? "none" : "auto")};
  cursor: ${(props) => (props.$active ? "none" : "pointer")};

  &:hover,
  &:focus {
    color: ${(props) =>
      props.$active ? "var(--color-highlight)" : "var(--color-neutral)"};
    background-color: ${(props) =>
      props.$active ? "var(--color-primary)" : "var(--color-primary)"};
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

interface Props {
  expanded: boolean;
  handleExpand: () => void;
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
  text: LinkDataSelector;
  href: LinkDataSelector;
  icon: LinkIconSelector;
}
const NavBar = ({ expanded, handleExpand, linksLinst }: Props) => {
  const { pathname } = useLocation();
  const path = pathname.split("/").filter((item) => item);

  const linksData: LinksDataType = {
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
      aircraft: "/aircraft",
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

  const handlExpandButtonClick = () => {
    handleExpand();
  };

  return (
    <HtmlNavbar $expanded={expanded}>
      <HtmlNavBarGroup>
        <NavBarExpandButton
          isExpanded={expanded}
          handleClick={handlExpandButtonClick}
        />
      </HtmlNavBarGroup>
      <HtmlNavLinkContainer>
        {linksLinst.map((link) => (
          <HtmlNavLink
            key={link}
            to={linksData["href"][link as keyof LinkDataSelector]}
            $active={
              (!path.length && link === "flights") ||
              (path.length === 1 && path[0] === link)
            }
            onClick={handleExpand}
          >
            {linksData["icon"][link as keyof LinkIconSelector]}
            <HtmlLinkText>
              {linksData["text"][link as keyof LinkDataSelector]}
            </HtmlLinkText>
          </HtmlNavLink>
        ))}
      </HtmlNavLinkContainer>
      <HtmlNavBarGroup />
    </HtmlNavbar>
  );
};

export default NavBar;
