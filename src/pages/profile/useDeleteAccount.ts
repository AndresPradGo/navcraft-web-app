import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { APIClientError } from '../../services/apiClient';
import apiClient from './profileService'

const useDeleteAccount = (onDelete: () => void) => {
    return useMutation<string, APIClientError, undefined>({
        mutationFn: () => apiClient.delete("/me"),
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
        onError: (error) => {
            if(error.response)
                if (typeof error.response.data.detail === "string")
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
                else toast.error("Something went wrong, please try again later.", {
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