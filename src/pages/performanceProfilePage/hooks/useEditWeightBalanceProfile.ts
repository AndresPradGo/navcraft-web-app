import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIClientError } from '../../../services/apiClient';
import apiClient, {
  WeightAndBalanceProfileType,
} from '../../../services/weightBalanceProfileClient';
import { WeightAndBalanceDataFromAPI } from '../../../services/weightBalanceClient';
import errorToast from '../../../utils/errorToast';
import { FormDataWithId } from '../components/EditWeightBalanceProfileForm';
import getUTCNowString from '../../../utils/getUTCNowString';

interface WeightBalanceDataContext {
  previusData?: WeightAndBalanceDataFromAPI;
}

const useEditWeightBalanceProfile = (profileId: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    WeightAndBalanceProfileType,
    APIClientError,
    FormDataWithId,
    WeightBalanceDataContext
  >({
    mutationFn: (data) => {
      const formatedData = {
        name: data.name,
        limits: data.limits.map((limit, idx) => ({
          ...limit,
          sequence: idx + 1,
        })),
      };

      if (data.id === 0) {
        return apiClient.post(formatedData, `/${profileId}`);
      } else {
        return apiClient.edit(formatedData, `/${data.id}`);
      }
    },
    onMutate: (newData) => {
      const previusData = queryClient.getQueryData<WeightAndBalanceDataFromAPI>(
        ['AircraftWeightBalanceData', profileId],
      );
      queryClient.setQueryData<WeightAndBalanceDataFromAPI>(
        ['AircraftWeightBalanceData', profileId],
        (currentData) => {
          if (newData.id === 0) {
            return currentData
              ? {
                  ...currentData,
                  weight_balance_profiles: [
                    ...currentData.weight_balance_profiles,
                    {
                      id: 0,
                      name: newData.name,
                      limits: newData.limits.map((limit, idx) => ({
                        ...limit,
                        sequence: idx + 1,
                        id: idx + 1,
                      })),
                      created_at_utc: getUTCNowString(),
                      last_updated_utc: getUTCNowString(),
                    },
                  ],
                }
              : undefined;
          } else {
            return currentData
              ? {
                  ...currentData,
                  weight_balance_profiles:
                    currentData.weight_balance_profiles.map((profile) => {
                      if (profile.id === newData.id)
                        return {
                          ...profile,
                          name: newData.name,
                          limits: newData.limits.map((limit, idx) => ({
                            ...limit,
                            sequence: idx + 1,
                            id: idx + 1,
                          })),
                          last_updated_utc: getUTCNowString(),
                        };
                      else return profile;
                    }),
                }
              : undefined;
          }
        },
      );
      return { previusData };
    },
    onSuccess: (savedData, newData) => {
      toast.success(
        `W&B Profile "${savedData.name}" has been ${newData.id === 0 ? 'added' : 'updated'} successfully.`,
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
      queryClient.invalidateQueries<WeightAndBalanceDataFromAPI>([
        'AircraftWeightBalanceData',
        profileId,
      ]);
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (context?.previusData) {
        queryClient.setQueryData<WeightAndBalanceDataFromAPI>(
          ['AircraftWeightBalanceData', profileId],
          context.previusData,
        );
      }
    },
  });
};

export default useEditWeightBalanceProfile;
