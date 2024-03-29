import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import { ClimbAdjustmentValuesFromForm } from '../components/EditClimbDataForm';
import apiClient, {
  ClimbPerformanceDataFromAPI,
} from '../../../services/aircraftClimbDataClient';
import errorToast from '../../../utils/errorToast';

interface ClimbContext {
  previousData?: ClimbPerformanceDataFromAPI;
}

const useEditClimbData = (profileId: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    string,
    APIClientError,
    ClimbAdjustmentValuesFromForm,
    ClimbContext
  >({
    mutationFn: (data) => {
      return apiClient.editAndGetOther<string>(
        data,
        `/climb-adjustments/${profileId}`,
      );
    },
    onMutate: (newData) => {
      const previousData =
        queryClient.getQueryData<ClimbPerformanceDataFromAPI>([
          'aircraftClimbPerformance',
          profileId,
        ]);
      queryClient.setQueryData<ClimbPerformanceDataFromAPI>(
        ['aircraftClimbPerformance', profileId],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                take_off_taxi_fuel_gallons: newData.take_off_taxi_fuel_gallons,
                percent_increase_climb_temperature_c:
                  newData.percent_increase_climb_temperature_c,
              }
            : undefined;
        },
      );
      return { previousData };
    },
    onSuccess: async () => {
      toast.success(
        `Climb performance adjustment values have been updated successfully.`,
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
      await queryClient.invalidateQueries<ClimbPerformanceDataFromAPI>([
        'aircraftClimbPerformance',
        profileId,
      ]);
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (context?.previousData) {
        queryClient.setQueryData<ClimbPerformanceDataFromAPI>(
          ['aircraftClimbPerformance', profileId],
          context.previousData,
        );
      }
    },
  });
};

export default useEditClimbData;
