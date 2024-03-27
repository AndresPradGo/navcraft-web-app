import APIClient from '../../../services/apiClient';
import { FlightDataFromApi } from '../../../services/flightClient';
import {
  CoordinateDataType,
  IdentifierDataType,
} from '../components/map/DropMarkerForm';

export interface PostLegFromExistingWaypoint {
  existing_waypoint_id: number;
  sequence: number;
}

interface NewWaypoint extends CoordinateDataType, IdentifierDataType {}

export interface PostLegFromNewLocation {
  new_waypoint: NewWaypoint;
  sequence: number;
}

export interface EditLegData {
  existing_waypoint_id: number;
  temperature_c: number;
  altimeter_inhg: number;
  wind_direction: number;
  wind_magnitude_knot: number;
  temperature_last_updated: string;
  wind_last_updated: string;
  altimeter_last_updated: string;
  altitude_ft: number;
}

const apiClient = new APIClient<PostLegFromExistingWaypoint, FlightDataFromApi>(
  '/flight-legs',
);

export default apiClient;
