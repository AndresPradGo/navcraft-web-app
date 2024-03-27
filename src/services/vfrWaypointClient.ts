import APIClient from './apiClient';
import { WaypointDataFromAPI, EditWaypointData } from './userWaypointClient';

export interface VfrWaypointDataFromAPI extends WaypointDataFromAPI {
  hidden: boolean;
}

export interface EditVfrWaypointData extends EditWaypointData {
  hidden: boolean;
}

const apiClient = new APIClient<EditVfrWaypointData, VfrWaypointDataFromAPI>(
  '',
);

export default apiClient;
