import APIClient from './apiClient';
import { CompartmentDataFromForm } from '../pages/performanceProfilePage/components/EditBaggageCompartmentForm';
import { SeatRowDataFromForm } from '../pages/performanceProfilePage/components/EditSeatRowForm';
import { FuelTankDataFromForm } from '../pages/performanceProfilePage/components/EditFuelTankForm';

export interface AircraftArrangementDataFromAPI {
  baggage_compartments: CompartmentDataFromForm[];
  seat_rows: SeatRowDataFromForm[];
  fuel_tanks: FuelTankDataFromForm[];
}
const apiClient = new APIClient<
  CompartmentDataFromForm | SeatRowDataFromForm | FuelTankDataFromForm,
  AircraftArrangementDataFromAPI
>('/aircraft-arrangement-data');

export default apiClient;
