import { FaMapLocationDot, FaUserGear, FaUsersGear } from "react-icons/fa6";
import { IoAirplane } from "react-icons/io5";
import { MdFlightTakeoff } from "react-icons/md";
import { IconType } from "react-icons";
import useAuth from '../../hooks/useAuth';

interface NavLinkData {
  text: string;
  href: string;
  icon: IconType;
}

const useNavLinks = (): NavLinkData[] => {
  const user = useAuth()
  const userIsMaster = user && user.is_master

  const navLinksData = [
    {
      text: "Flights",
      href: "/flights",
      icon: MdFlightTakeoff,
    },
    {
      text: "Waypoints",
      href: "/waypoints",
      icon: FaMapLocationDot,
    },
    {
      text: "Aircraft",
      href: "/aircraft-list",
      icon: IoAirplane,
    },
    {
      text: "Profile",
      href: "/profile",
      icon: FaUserGear,
    },
    {
      text: "Users",
      href: "/users",
      icon: FaUsersGear,
    },
  ];

  return userIsMaster
    ? navLinksData
    : navLinksData.filter((item) => item.href !== "/users");
};

export default useNavLinks;
