import { useState, ReactNode } from "react";
import { animateScroll as scroll } from "react-scroll";

import SideBarContext from "./sideBarContext";
import { usePathList } from "../../router";

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

  const [sideBarIsExpanded, setSideBarIsExpanded] = useState<boolean>(false);

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
