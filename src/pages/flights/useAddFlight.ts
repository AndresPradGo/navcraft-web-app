import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../services/apiClient';
import apiClient, {
  FlightSummaryDataFromApi,
  AddFlightData,
} from '../../services/flightsClient';
import errorToast from '../../utils/errorToast';

interface FlightContext {
  previousData?: FlightSummaryDataFromApi[];
}

const useAddFlight = () => {
  const queryClient = useQueryClient();
  return useMutation<
    FlightSummaryDataFromApi,
    APIClientError,
    AddFlightData,
    FlightContext
  >({
    mutationFn: (data) => apiClient.post(data),
    onMutate: (newData) => {
      const previousData = queryClient.getQueryData<FlightSummaryDataFromApi[]>(
        ['flights', 'all'],
      );
      queryClient.setQueryData<FlightSummaryDataFromApi[]>(
        ['flights', 'all'],
        (currentData) => {
          const flightToAdd = {
            id: 0,
            departure_time: newData.departure_time,
            aircraft_id: newData.aircraft_id,
            departure_aerodrome_id: newData.departure_aerodrome_id,
            arrival_aerodrome_id: newData.arrival_aerodrome_id,
            departure_aerodrome_is_private: false,
            arrival_aerodrome_is_private: false,
            waypoints: [],
          };
          return currentData ? [...currentData, flightToAdd] : [flightToAdd];
        },
      );
      return { previousData };
    },
    onSuccess: (savedData) => {
      toast.success('New Flight has been added successfully.', {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      queryClient.setQueryData<FlightSummaryDataFromApi[]>(
        ['flights', 'all'],
        (currentData) => {
          return currentData
            ? currentData.map((flight) => {
                if (flight.id === 0) return savedData;
                else return flight;
              })
            : [savedData];
        },
      );
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (context?.previousData) {
        queryClient.setQueryData<FlightSummaryDataFromApi[]>(
          ['flights', 'all'],
          context.previousData,
        );
      }
    },
  });
};

export default useAddFlight;
