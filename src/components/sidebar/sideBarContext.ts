import React from 'react';

interface SideBarContextType {
  hasSideBar: boolean;
  sideBarIsExpanded: boolean;
  handleExpandSideBar: (expand: boolean, fromNavBar?: boolean) => void;
}

const SideBarContext = React.createContext<SideBarContextType>(
  {} as SideBarContextType,
);

export default SideBarContext;
