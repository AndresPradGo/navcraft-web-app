import { FaMapLocationDot, FaUserGear, FaUsersGear } from "react-icons/fa6";
import { IoAirplane } from "react-icons/io5";
import { PiAirplaneInFlightDuotone } from "react-icons/pi";
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
      icon: PiAirplaneInFlightDuotone,
    },
    {
      text: "Waypoints",
      href: "/waypoints",
      icon: FaMapLocationDot,
    },
    {
      text: "Aircraft",
      href: "/aircraft",
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
