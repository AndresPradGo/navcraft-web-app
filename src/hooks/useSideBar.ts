
import { useContext } from 'react';
import SideBarContext from '../contexts/sideBarContext';

const useSideBar = () => useContext(SideBarContext)

export default useSideBar