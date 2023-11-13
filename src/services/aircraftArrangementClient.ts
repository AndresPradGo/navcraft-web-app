import APIClient from './apiClient';
import {CompartmentDataFromForm} from '../pages/performanceProfilePage/components/EditBaggageCompartmentForm'

interface AircraftArrangementDataFromAPI {
    baggage_compartments: CompartmentDataFromForm[]
}
const apiClient = new APIClient<CompartmentDataFromForm, AircraftArrangementDataFromAPI>("/aircraft-arrangement-data")

export default apiClient