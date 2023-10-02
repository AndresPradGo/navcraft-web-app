import { useLocation } from "react-router-dom";
import { IconType } from "react-icons";

import { NavLinkData } from '../entities/NavLinkData';

interface TitleDataType {
    titleText: string;
    titleIcon: IconType;
}

interface PathDataType {
    titleData: TitleDataType | null;
    hasSideBar: boolean;
}

const usePathData = (navBarLinks: NavLinkData[]): PathDataType => {
    const { pathname } = useLocation();
    const currentPath = pathname.split("/").filter((item) => item);

    if (currentPath.length) {
        const titleData = navBarLinks.find(
            (item) => currentPath.length === 1 && `/${currentPath[0]}` === item.href);
        if (titleData) return ({
            titleData: {
                titleText: titleData.text,
                titleIcon: titleData.icon
            },
            hasSideBar: true
        })
    }
  
    return {titleData: null, hasSideBar: true}
}

export default usePathData;