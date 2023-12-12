import APIClient from '../../../services/apiClient';

interface EditFuelOnBoardData {
    gallons: number,
}

export interface FuelOnBoardDataFromAPI extends EditFuelOnBoardData {
    id: number,
    fuel_tank_id: number,
    weight_lb: number
}

const apiClient = new APIClient<EditFuelOnBoardData, FuelOnBoardDataFromAPI>("/flight-weight-balance-data/fuel")

export default apiClient;