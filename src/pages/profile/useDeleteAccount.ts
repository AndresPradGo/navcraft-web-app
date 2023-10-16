import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient from './profileService'

const useDeleteAccount = (onDelete: () => void) => {
    return useMutation<string, APIClientError, string>({
        mutationFn: (JWT) => apiClient.delete(JWT),
        onSuccess: () => {
            toast.info("Your Account has been deleted successfully...", {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            onDelete()
        },
        onError: (error: APIClientError) => {
            if(error.response && error.response.status === 400)
                toast.error(error.response.data.detail, {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
        }
    })
}

export default useDeleteAccount