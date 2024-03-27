import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import apiClient, {
  WeightAndBalanceDataFromAPI,
} from '../../../services/weightBalanceClient';
import errorToast from '../../../utils/errorToast';
import { WeightBalanceDataFromForm } from '../components/EditWeightAndBalanceDataForm';
import { CompletePerformanceProfileDataFromAPI } from '../../../services/aircraftClient';

interface WeightBalanceDataContext {
  previousData?: WeightAndBalanceDataFromAPI;
}

const useEditWeightBalanceData = (profileId: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    WeightAndBalanceDataFromAPI,
    APIClientError,
    WeightBalanceDataFromForm,
    WeightBalanceDataContext
  >({
    mutationFn: (data) => {
      return apiClient.editAndPreProcess<CompletePerformanceProfileDataFromAPI>(
        data,
        (dataFromApi) => ({
          id: dataFromApi.id,
          center_of_gravity_in: dataFromApi.center_of_gravity_in,
          empty_weight_lb: dataFromApi.empty_weight_lb,
          max_ramp_weight_lb: dataFromApi.max_ramp_weight_lb,
          max_takeoff_weight_lb: dataFromApi.max_takeoff_weight_lb,
          max_landing_weight_lb: dataFromApi.max_landing_weight_lb,
          baggage_allowance_lb: dataFromApi.baggage_allowance_lb,
          created_at_utc: dataFromApi.created_at_utc,
          last_updated_utc: dataFromApi.last_updated_utc,
          weight_balance_profiles: [],
        }),
        `/${profileId}`,
      );
    },
    onMutate: (newData) => {
      const previousData =
        queryClient.getQueryData<WeightAndBalanceDataFromAPI>([
          'AircraftWeightBalanceData',
          profileId,
        ]);
      queryClient.setQueryData<WeightAndBalanceDataFromAPI>(
        ['AircraftWeightBalanceData', profileId],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                center_of_gravity_in: newData.center_of_gravity_in,
                empty_weight_lb: newData.empty_weight_lb,
                max_ramp_weight_lb: newData.max_ramp_weight_lb,
                max_takeoff_weight_lb: newData.max_takeoff_weight_lb,
                max_landing_weight_lb: newData.max_landing_weight_lb,
                baggage_allowance_lb: newData.baggage_allowance_lb,
              }
            : undefined;
        },
      );
      return { previousData };
    },
    onSuccess: (savedData) => {
      toast.success(`W&B Data has been updated successfully.`, {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      queryClient.setQueryData<WeightAndBalanceDataFromAPI>(
        ['AircraftWeightBalanceData', profileId],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                center_of_gravity_in: savedData.center_of_gravity_in,
                empty_weight_lb: savedData.empty_weight_lb,
                max_ramp_weight_lb: savedData.max_ramp_weight_lb,
                max_takeoff_weight_lb: savedData.max_takeoff_weight_lb,
                max_landing_weight_lb: savedData.max_landing_weight_lb,
                baggage_allowance_lb: savedData.baggage_allowance_lb,
              }
            : undefined;
        },
      );
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (context?.previousData) {
        queryClient.setQueryData<WeightAndBalanceDataFromAPI>(
          ['AircraftWeightBalanceData', profileId],
          context.previousData,
        );
      }
    },
  });
};

export default useEditWeightBalanceData;
