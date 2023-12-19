
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import { APIClientError } from '../services/apiClient';


const useUnauthorizedErrorHandler = (errors: (APIClientError | null)[]) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    for (const error of errors) {
        if (error && error.response?.status === 401) {
            queryClient.clear();
            localStorage.removeItem("token");
            localStorage.removeItem("token_type");
            navigate("/login");
            toast.error('Invalid credentials, please login with a valid email and password.', {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return
    }
    }
}

export default useUnauthorizedErrorHandler