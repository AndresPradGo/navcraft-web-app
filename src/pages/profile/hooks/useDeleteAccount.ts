import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../../services/apiClient';
import apiClient from '../profileService';
import errorToast from '../../../utils/errorToast';

const useDeleteAccount = (onDelete: () => void) => {
  return useMutation<string, APIClientError, undefined>({
    mutationFn: () => apiClient.delete('/me'),
    onSuccess: () => {
      toast.success('Your Account has been deleted successfully.', {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      onDelete();
    },
    onError: (error) => {
      errorToast(error);
    },
  });
};

export default useDeleteAccount;
