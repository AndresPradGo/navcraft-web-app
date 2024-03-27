import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

import apiClient from '../profileService';
import { APIClientError } from '../../../services/apiClient';
import { EditUserResponse, ProfileData } from '../entities';
import { FormDataType as EditProfileBody } from '../components/EditProfileForm';
import errorToast from '../../../utils/errorToast';

interface EditProfileContext {
  previusData?: ProfileData;
}

const useEditProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ProfileData,
    APIClientError,
    EditProfileBody,
    EditProfileContext
  >({
    mutationFn: (data) => {
      return apiClient.editOtherAndPreProcess<
        EditProfileBody,
        EditUserResponse
      >(
        data,
        (preProcessedData) => ({
          id: preProcessedData.id,
          name: preProcessedData.name,
          email: preProcessedData.email,
          weight: preProcessedData.weight_lb,
        }),
        '/me',
      );
    },
    onMutate: (newData: EditProfileBody) => {
      const previusData = queryClient.getQueryData<ProfileData>(['profile']);
      queryClient.setQueryData<ProfileData>(['profile'], (currentData) =>
        currentData
          ? { ...currentData, name: newData.name, weight: newData.weight_lb }
          : undefined,
      );
      return { previusData };
    },
    onSuccess: (data) => {
      toast.success('Your Profile has been Updated.', {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      queryClient.setQueryData<ProfileData>(['profile'], {
        id: data.id,
        name: data.name,
        email: data.email,
        weight: data.weight,
      });
    },
    onError: (error, _, context) => {
      errorToast(error);
      if (!context?.previusData) return;
      queryClient.setQueryData<ProfileData>(['profile'], context.previusData);
    },
  });
};

export default useEditProfile;
