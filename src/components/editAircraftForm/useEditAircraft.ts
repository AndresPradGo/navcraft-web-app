import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import apiClient, { AircraftDataFromAPI } from '../../services/aircraftClient';
import { APIClientError } from '../../services/apiClient';
import { AircraftDataFromForm } from './EditAircraftForm';
import errorToast from '../../utils/errorToast';
import getUTCNowString from '../../utils/getUTCNowString';

interface AircraftContext {
  previusData?: AircraftDataFromAPI;
}

const useEditAircraft = () => {
  const queryClient = useQueryClient();
  return useMutation<
    AircraftDataFromAPI,
    APIClientError,
    AircraftDataFromForm,
    AircraftContext
  >({
    mutationFn: (data) => apiClient.edit(data, `/${data.id}`),
    onMutate: (newData) => {
      const previusData = queryClient.getQueryData<AircraftDataFromAPI>([
        'aircraft',
        newData.id,
      ]);
      queryClient.setQueryData<AircraftDataFromAPI>(
        ['aircraft', newData.id],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                make: newData.make,
                model: newData.model,
                abbreviation: newData.abbreviation,
                registration: newData.registration,
                last_updated_utc: getUTCNowString(),
              }
            : undefined;
        },
      );
      return { previusData };
    },
    onSuccess: (savedData) => {
      toast.success(
        `"${savedData.registration}" has been edited successfully.`,
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
        ['aircraft', savedData.id],
        (currentData) => {
          return currentData
            ? {
                ...currentData,
                make: savedData.make,
                model: savedData.model,
                abbreviation: savedData.abbreviation,
                registration: savedData.registration,
                created_at_utc: savedData.created_at_utc,
                last_updated_utc: savedData.last_updated_utc,
              }
            : undefined;
        },
      );
    },
    onError: (error, newData, context) => {
      errorToast(error);
      if (context?.previusData) {
        queryClient.setQueryData<AircraftDataFromAPI>(
          ['aircraft', newData.id],
          context.previusData,
        );
      }
    },
  });
};

export default useEditAircraft;
