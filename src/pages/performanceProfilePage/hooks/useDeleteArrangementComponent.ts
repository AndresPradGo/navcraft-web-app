import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import errorToast from '../../../utils/errorToast';
import apiClient, {
  AircraftArrangementDataFromAPI,
} from '../../../services/aircraftArrangementClient';

interface DeleteData {
  type: 'Baggage Compartment' | 'Fuel Tank' | 'Seat Row';
  id: number;
  name: string;
}

interface AircraftArrangementContext {
  previousData?: AircraftArrangementDataFromAPI;
}

const useDeleteArrangementComponent = (
  profileId: number,
  aircraftId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    string,
    APIClientError,
    DeleteData,
    AircraftArrangementContext
  >({
    mutationFn: (data) => {
      const endpoint = `/${
        data.type === 'Fuel Tank'
          ? 'fuel-tank'
          : data.type === 'Seat Row'
            ? 'seat-row'
            : 'baggage-compartment'
      }/${data.id}`;

      return apiClient.delete(endpoint);
    },
    onMutate: (data) => {
      const previousData =
        queryClient.getQueryData<AircraftArrangementDataFromAPI>([
          'AircraftArrangementData',
          profileId,
        ]);
      queryClient.setQueryData<AircraftArrangementDataFromAPI>(
        ['AircraftArrangementData', profileId],
        (currentData) => {
          if (data.type === 'Baggage Compartment') {
            return currentData
              ? {
                  ...currentData,
                  baggage_compartments: currentData.baggage_compartments.filter(
                    (item) => item.id !== data.id,
                  ),
                }
              : undefined;
          } else if (data.type === 'Fuel Tank') {
            return currentData
              ? {
                  ...currentData,
                  fuel_tanks: currentData.fuel_tanks.filter(
                    (item) => item.id !== data.id,
                  ),
                }
              : undefined;
          } else {
            return currentData
              ? {
                  ...currentData,
                  seat_rows: currentData.seat_rows.filter(
                    (item) => item.id !== data.id,
                  ),
                }
              : undefined;
          }
        },
      );
      return { previousData };
    },
    onSuccess: (_, data) => {
      toast.success(
        `${data.type} "${data.name}", has been deleted successfully.`,
        {
          position: 'top-center',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        },
      );
      queryClient.invalidateQueries({
        queryKey: ['AircraftArrangementData', profileId],
      });
      queryClient.invalidateQueries({ queryKey: ['aircraft', aircraftId] });
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (context?.previousData) {
        queryClient.setQueryData<AircraftArrangementDataFromAPI>(
          ['AircraftArrangementData', profileId],
          context.previousData,
        );
      }
    },
  });
};

export default useDeleteArrangementComponent;
