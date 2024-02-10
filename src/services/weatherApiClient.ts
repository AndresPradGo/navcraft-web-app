import axios from 'axios'
import useAuth from '../hooks/useAuth';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_NAVBRIX_API_URL
})

interface APIResponseData {
    detail: string | {[key: string]: unknown}[]
}
interface APIResponse {
    data: APIResponseData,
    status: number
}

export interface APIClientError extends Error {
    response?: APIResponse
}

class APIClient<TPost, TGet> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    private _setAuthHeader = () => {
        const user = useAuth()
        axiosInstance.defaults.headers.common['x-auth-token'] = user? user.jwt : ""
    }

    private _getEndpoint = (endpointPostfix?: string): string => {
        return `${this.endpoint}${endpointPostfix ? endpointPostfix : ""}`
    }

    post = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader()
        return axiosInstance.post<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }
}

export default APIClient