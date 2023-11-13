import APIClient from './apiClient';
import {CompartmentDataFromForm} from '../pages/performanceProfilePage/components/EditBaggageCompartmentForm'
import {SeatRowDataFromForm} from '../pages/performanceProfilePage/components/EditSeatRowForm'


interface AircraftArrangementDataFromAPI {
    baggage_compartments: CompartmentDataFromForm[];
    seat_rows : SeatRowDataFromForm[];
}
const apiClient = new APIClient<
    CompartmentDataFromForm | SeatRowDataFromForm, 
    AircraftArrangementDataFromAPI
>("/aircraft-arrangement-data")

export default apiClient