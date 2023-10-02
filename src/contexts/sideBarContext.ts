import { Dispatch } from "react"
import React from "react"

interface SideBarContextType {
    sideBarIsExpanded: boolean, 
    setSideBarIsExpanded: Dispatch<React.SetStateAction<boolean>>
}

const SideBarContext = React.createContext<SideBarContextType>({} as SideBarContextType);

export default SideBarContext;