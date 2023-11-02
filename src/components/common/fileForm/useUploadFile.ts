import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import APIClient, {APIClientError} from '../../../services/apiClient';

const apiClient = new APIClient<FormData, string>("/")

const useUploadFile = (path: string, successMessage: string, queryKey: (string | number)[]) => {
    const queryClient = useQueryClient()
    return useMutation<string, APIClientError, FormData>({
        mutationFn: (data) => apiClient.post(data, path),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey})
            toast.success(`${successMessage} data has been updated successfully`, {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        },
        onError: (error) => {
            if(error.response) {
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
            } else toast.error("Something went wrong, please try again later.", {
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

export default useUploadFile