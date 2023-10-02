import { useLocation } from "react-router-dom";

const usePathList = (): string[] => {
    const { pathname } = useLocation();
    let currentPath = pathname.split("/").filter((item) => item);
    currentPath = currentPath.length ? currentPath : ["flights"];
  
    return currentPath
}

export default usePathList;