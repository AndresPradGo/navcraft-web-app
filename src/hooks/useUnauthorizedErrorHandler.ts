import { useQueryClient } from "@tanstack/react-query";

import { APIClientError } from '../services/apiClient';


const useUnauthorizedErrorHandler = (errors: (APIClientError | null)[]) => {
    const queryClient = useQueryClient();

    for (const error of errors) {
        if (error && error.response?.status === 401) {
            queryClient.clear();
            localStorage.removeItem("token");
            localStorage.removeItem("token_type");
            window.location.href = "/login?credentials=invalid";
            return
        }
    }
}

export default useUnauthorizedErrorHandler