import { useState, ReactNode } from "react";
import { animateScroll as scroll } from "react-scroll";

import SideBarContext from "./sideBarContext";
import { usePathList } from "../../router";
import useScroll from "../../hooks/useScroll";
import useAuth from "../../hooks/useAuth";

interface Props {
  children: ReactNode;
}

const SideBarProvider = ({ children }: Props) => {
  const pathsWithSideBar = [
    {
      path: ["profile"],
      needsAdmin: false,
    },
    {
      path: ["waypoints", "private-aerodrome"],
      needsAdmin: false,
    },
    {
      path: ["waypoints"],
      needsAdmin: false,
    },
  ];

  const user = useAuth();

  const pathname = usePathList();

  const hasSideBar = pathsWithSideBar.find((item) => {
    if (item.needsAdmin && !user?.is_admin) return false;
    for (let i = 0; i < item.path.length; i++) {
      if (item.path[i] !== pathname[i]) {
        return false;
      }
    }
    return true;
  })
    ? true
    : false;

  const [sideBarIsExpanded, setSideBarIsExpanded] = useState<boolean>(false);

  useScroll(hasSideBar);

  const handleExpandSideBar = (expand: boolean, fromNavBar?: boolean) => {
    if (!fromNavBar) {
      scroll.scrollMore(0.5, {
        duration: 1,
        delay: 200,
        smooth: false,
      });
      scroll.scrollMore(-0.5, {
        duration: 1,
        delay: 200,
        smooth: false,
      });
    }
    setSideBarIsExpanded(expand);
  };

  return (
    <SideBarContext.Provider
      value={{
        hasSideBar,
        sideBarIsExpanded,
        handleExpandSideBar,
      }}
    >
      {children}
    </SideBarContext.Provider>
  );
};

export default SideBarProvider;
