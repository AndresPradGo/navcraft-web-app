import { FaUserGear, FaUsersGear } from 'react-icons/fa6';
import { IoAirplane } from 'react-icons/io5';
import { PiAirplaneInFlightDuotone } from 'react-icons/pi';
import { RiMapPinFill } from 'react-icons/ri';
import { IconType } from 'react-icons';
import useAuth from '../../hooks/useAuth';
import type { ReactIconType } from '../../services/reactIconEntity';

interface NavLinkData {
  text: string;
  href: string;
  icon: IconType;
}

const useNavLinks = (): NavLinkData[] => {
  const user = useAuth();
  const userIsMaster = user && user.is_master;

  const navLinksData = [
    {
      text: 'Flights',
      href: '/flights',
      icon: PiAirplaneInFlightDuotone as ReactIconType,
    },
    {
      text: 'Waypoints',
      href: '/waypoints',
      icon: RiMapPinFill as ReactIconType,
    },
    {
      text: 'Aircraft',
      href: '/aircraft',
      icon: IoAirplane as ReactIconType,
    },
    {
      text: 'Profile',
      href: '/profile',
      icon: FaUserGear as ReactIconType,
    },
    {
      text: 'Users',
      href: '/users',
      icon: FaUsersGear as ReactIconType,
    },
  ];

  return userIsMaster
    ? navLinksData
    : navLinksData.filter((item) => item.href !== '/users');
};

export default useNavLinks;
