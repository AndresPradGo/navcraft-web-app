import { useState, ReactNode } from "react";

import SideBarContext from "./sideBarContext";
import usePathList from "../../hooks/usePathList";

interface Props {
  children: ReactNode;
}

const SideBarProvider = ({ children }: Props) => {
  const pathsWithSideBar = [
    {
      path: "flights",
      minLength: 1,
    },
  ];

  const pathname = usePathList();

  const hasSideBar = pathsWithSideBar.find(
    (item) => item.path === pathname[0] && pathname.length >= item.minLength
  )
    ? true
    : false;

  const [sideBarIsExpanded, setSideBarIsExpanded] = useState(false);

  return (
    <SideBarContext.Provider
      value={{
        hasSideBar,
        sideBarIsExpanded,
        setSideBarIsExpanded: hasSideBar ? setSideBarIsExpanded : () => {},
      }}
    >
      {children}
    </SideBarContext.Provider>
  );
};

export default SideBarProvider;
