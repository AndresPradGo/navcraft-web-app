import { useState } from "react";
import { BiSolidErrorAlt } from "react-icons/bi";
import { FaMapLocationDot, FaUserGear, FaUsersGear } from "react-icons/fa6";
import { MdFlightTakeoff, MdAirplanemodeActive } from "react-icons/md";
import { useLocation, Navigate } from "react-router-dom";
import { styled } from "styled-components";

import NavBar from "../components/NavBar";
import ContentSection from "./ContentSection";
import SideBarContext from "../state-management/contexts/sideBarContext";
interface HtmlLayoutContainerProps {
  $numNavLinks: number;
  $navBarIsExpanded: boolean;
}

const HtmlLayoutContainer = styled.div<HtmlLayoutContainerProps>`
  transition: all 0.5s ease-out;
  overflow: hidden;
  display: grid;
  min-height: 100vh;
  width: 100vw;
  grid-template-rows: ${(props) =>
      props.$navBarIsExpanded ? props.$numNavLinks * 50 + 64 : 62}px auto 100px;
  grid-template-columns: 100%;
  grid-template-areas:
    "header"
    "main"
    "footer";

  @media screen and (min-width: 768px) {
    grid-template-rows: 72px auto 100px;
  }
`;

const Layout = () => {
  const { pathname } = useLocation();
  const currentPath = pathname.split("/").filter((item) => item);
  if (!currentPath.length) return <Navigate to="/flights" />;

  const [sideBarIsExpanded, setSideBarIsExpanded] = useState(false);
  const [navBarIsExpanded, setNavBarIsExpanded] = useState(false);
  const [navBarLinks, setNavBarLinks] = useState([
    {
      text: "Flights",
      href: "/flights",
      icon: <MdFlightTakeoff />,
    },
    {
      text: "Waypoints",
      href: "/waypoints",
      icon: <FaMapLocationDot />,
    },
    {
      text: "Aircraft",
      href: "/aircraft",
      icon: <MdAirplanemodeActive />,
    },
    {
      text: "Profile",
      href: "/profile",
      icon: <FaUserGear />,
    },
    {
      text: "Users",
      href: "/users",
      icon: <FaUsersGear />,
    },
  ]);

  const titleData = navBarLinks.find(
    (item) => currentPath.length === 1 && `/${currentPath[0]}` === item.href
  );

  return (
    <SideBarContext.Provider
      value={{ sideBarIsExpanded, setSideBarIsExpanded }}
    >
      <HtmlLayoutContainer
        $numNavLinks={navBarLinks.length}
        $navBarIsExpanded={navBarIsExpanded}
      >
        <NavBar
          expanded={navBarIsExpanded}
          handleExpand={setNavBarIsExpanded}
          linksLinst={navBarLinks}
        />
        <ContentSection
          titleText={titleData ? titleData.text : ""}
          titleIcon={titleData ? titleData.icon : <BiSolidErrorAlt />}
        />
      </HtmlLayoutContainer>
    </SideBarContext.Provider>
  );
};

export default Layout;
