import { useLocation, useParams } from "react-router-dom";

const usePathList = (): string[] => {
    const { pathname } = useLocation();
    const patchAndSearch = pathname.split("?")
    const pathNameWithaoutSearch = patchAndSearch[0]
    let currentPath = pathNameWithaoutSearch.split("/").filter((item) => item);
    currentPath = currentPath.length ? currentPath : ["flights"];
    const numParams = Object.keys(useParams()).length

    if(numParams > 0)
        return currentPath.slice(0, -numParams)
    return currentPath
}

export default usePathList;