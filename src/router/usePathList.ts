import { useLocation, useParams } from 'react-router-dom';

const usePathList = (): string[] => {
  const { pathname } = useLocation();
  const patchAndSearch = pathname.split('?');
  const pathNameWithaoutSearch = patchAndSearch[0];
  let currentPath = pathNameWithaoutSearch.split('/').filter((item) => item);
  currentPath = currentPath.length ? currentPath : ['flights'];
  const params = Object.values(useParams());

  if (params.length > 0)
    return currentPath.filter(
      (item) => !params.find((param) => item === param),
    );
  return currentPath;
};

export default usePathList;
