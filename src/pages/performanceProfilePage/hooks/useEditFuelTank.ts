import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import { FuelTankDataFromForm } from '../components/EditFuelTankForm';
import apiClient, {
  AircraftArrangementDataFromAPI,
} from '../../../services/aircraftArrangementClient';
import errorToast from '../../../utils/errorToast';

interface AircraftArrangementContext {
  previousData?: AircraftArrangementDataFromAPI;
}

const useEditFuelTank = (profileId: number, aircraftId: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    FuelTankDataFromForm,
    APIClientError,
    FuelTankDataFromForm,
    AircraftArrangementContext
  >({
    mutationFn: (data) => {
      if (data.id === 0)
        return apiClient.postAndGetOther<FuelTankDataFromForm>(
          data,
          `/fuel-tank/${profileId}`,
        );
      else
        return apiClient.editAndGetOther<FuelTankDataFromForm>(
          data,
          `/fuel-tank/${data.id}`,
        );
    },
    onMutate: (newData) => {
      const previousData =
        queryClient.getQueryData<AircraftArrangementDataFromAPI>([
          'AircraftArrangementData',
          profileId,
        ]);
      queryClient.setQueryData<AircraftArrangementDataFromAPI>(
        ['AircraftArrangementData', profileId],
        (currentData) => {
          if (newData.id === 0) {
            return currentData
              ? {
                  ...currentData,
                  fuel_tanks: [newData, ...currentData.fuel_tanks],
                }
              : {
                  fuel_tanks: [newData],
                  baggage_compartments: [],
                  seat_rows: [],
                };
          } else {
            return currentData
              ? {
                  ...currentData,
                  fuel_tanks: currentData.fuel_tanks.map((item) =>
                    item.id === newData.id ? newData : item,
                  ),
                }
              : {
                  fuel_tanks: [newData],
                  baggage_compartments: [],
                  seat_rows: [],
                };
          }
        },
      );
      return { previousData };
    },
    onSuccess: (savedData, newData) => {
      toast.success(
        `${savedData.name} has been ${newData.id === 0 ? 'added' : 'edited'} successfully.`,
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
      queryClient.setQueryData<AircraftArrangementDataFromAPI>(
        ['AircraftArrangementData', profileId],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                fuel_tanks: currentData.fuel_tanks.map((item) =>
                  item.id === newData.id ? savedData : item,
                ),
              }
            : {
                fuel_tanks: [savedData],
                baggage_compartments: [],
                seat_rows: [],
              };
        },
      );
      if (newData.id === 0) {
        queryClient.invalidateQueries({ queryKey: ['aircraft', aircraftId] });
      }
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

export default useEditFuelTank;
