import { useContext } from 'react';
import modelPermissionsContext from './modelPermissionsContext';

const useModelPermissions = () => useContext(modelPermissionsContext);

export default useModelPermissions;
