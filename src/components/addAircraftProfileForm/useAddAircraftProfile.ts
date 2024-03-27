import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import APIClient, { APIClientError } from '../../services/apiClient';
import {
  PerformanceProfileBaseData,
  AircraftDataFromAPI,
  CompletePerformanceProfileDataFromAPI,
} from '../../services/aircraftClient';
import errorToast from '../../utils/errorToast';
import getUTCNowString from '../../utils/getUTCNowString';

interface AddProfileData {
  fuel_type_id: number;
  performance_profile_name: string;
}

interface AddProfileDataWithType extends AddProfileData {
  type: 'BLANK';
}

interface AddProfileFromModelDataWithType {
  model_id: number;
  type: 'MODEL';
  performance_profile_name: string;
  fuel_type_id: number;
}

interface AircraftContext {
  previousData?: AircraftDataFromAPI;
}

const apiClient = new APIClient<
  AddProfileData | undefined,
  PerformanceProfileBaseData
>('/aircraft/performance-profile');

const useAddAircraftProfile = (aircraftId: number) => {
  const queryClient = useQueryClient();
  return useMutation<
    PerformanceProfileBaseData,
    APIClientError,
    AddProfileFromModelDataWithType | AddProfileDataWithType,
    AircraftContext
  >({
    mutationFn: (data) => {
      let dataToSend = undefined;
      let endpointExtension = `/${aircraftId}`;
      if (data.type === 'BLANK') {
        dataToSend = {
          fuel_type_id: data.fuel_type_id,
          performance_profile_name: data.performance_profile_name,
        };
      } else endpointExtension = endpointExtension + `/${data.model_id}`;
      return apiClient.postAndPreProcess<CompletePerformanceProfileDataFromAPI>(
        dataToSend,
        (dataFromApi) => ({
          id: dataFromApi.id,
          is_complete: dataFromApi.is_complete,
          fuel_type_id: dataFromApi.fuel_type_id,
          performance_profile_name: dataFromApi.performance_profile_name,
          is_preferred: dataFromApi.is_preferred,
          created_at_utc: dataFromApi.created_at_utc,
          last_updated_utc: dataFromApi.last_updated_utc,
        }),
        endpointExtension,
      );
    },
    onMutate: (newData) => {
      const previousData = queryClient.getQueryData<AircraftDataFromAPI>([
        'aircraft',
        aircraftId,
      ]);
      queryClient.setQueryData<AircraftDataFromAPI>(
        ['aircraft', aircraftId],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                profiles: [
                  ...currentData.profiles,
                  {
                    id: 0,
                    is_preferred: false,
                    is_complete: newData.type === 'MODEL',
                    fuel_type_id: newData.fuel_type_id,
                    performance_profile_name: newData.performance_profile_name,
                    created_at_utc: getUTCNowString(),
                    last_updated_utc: getUTCNowString(),
                  },
                ],
              }
            : undefined;
        },
      );
      return { previousData };
    },
    onSuccess: (savedData) => {
      toast.success(
        `${savedData.performance_profile_name} has been added successfully.`,
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
      queryClient.setQueryData<AircraftDataFromAPI>(
        ['aircraft', aircraftId],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                profiles: currentData.profiles.map((item) => {
                  if (item.id === 0) {
                    return savedData;
                  }
                  return item;
                }),
              }
            : undefined;
        },
      );
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (context?.previousData) {
        queryClient.setQueryData<AircraftDataFromAPI>(
          ['aircraft', aircraftId],
          context.previousData,
        );
      }
    },
  });
};

export default useAddAircraftProfile;
