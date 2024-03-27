import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import errorToast from '../../../utils/errorToast';
import apiClient from '../../../services/weightBalanceProfileClient';
import { WeightAndBalanceDataFromAPI } from '../../../services/weightBalanceClient';

interface DeleteData {
  id: number;
  name: string;
}

interface AircraftArrangementContext {
  previousData?: WeightAndBalanceDataFromAPI;
}

const useDeleteWeightBalanceProfile = (profileId: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    string,
    APIClientError,
    DeleteData,
    AircraftArrangementContext
  >({
    mutationFn: (data) => apiClient.delete(`/${data.id}`),
    onMutate: (data) => {
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
                weight_balance_profiles:
                  currentData.weight_balance_profiles.filter(
                    (p) => p.id === data.id,
                  ),
              }
            : undefined;
        },
      );
      return { previousData };
    },
    onSuccess: (_, data) => {
      toast.success(
        `W&B Profile "${data.name}" has been deleted successfully.`,
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
        queryKey: ['AircraftWeightBalanceData', profileId],
      });
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

export default useDeleteWeightBalanceProfile;
