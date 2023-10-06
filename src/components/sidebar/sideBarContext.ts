import React from "react"

interface SideBarContextType {
    hasSideBar: boolean,
    sideBarIsExpanded: boolean, 
    setSideBarIsExpanded: (newExpandedState: boolean) => void
}

const SideBarContext = React.createContext<SideBarContextType>({} as SideBarContextType);

export default SideBarContext;