import { useLocation } from "react-router-dom";

const usePathList = (): string[] => {
    const { pathname } = useLocation();
    const patchAndSearch = pathname.split("?")
    const pathNameWithaoutSearch = patchAndSearch[0]
    let currentPath = pathNameWithaoutSearch.split("/").filter((item) => item);
    currentPath = currentPath.length ? currentPath : ["flights"];
  
    return currentPath
}

export default usePathList;