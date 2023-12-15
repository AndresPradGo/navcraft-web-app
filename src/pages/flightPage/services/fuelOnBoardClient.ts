import APIClient from '../../../services/apiClient';
import {FuelDataFromForm} from '../components/AddFuelForm'

export interface FuelOnBoardDataFromAPI extends FuelDataFromForm {
    fuel_tank_id: number,
    weight_lb: number
}

const apiClient = new APIClient<FuelDataFromForm, FuelOnBoardDataFromAPI>("/flight-weight-balance-data/fuel")

export default apiClient;