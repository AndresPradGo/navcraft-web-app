import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000'
})

interface APIResponseData {
    detail: string
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

    _setAuthHeader = (token: string) => {
        axiosInstance.defaults.headers.common['Authorization'] = token
    }

    _getEndpoint = (endpointPostfix?: string): string => {
        return `${this.endpoint}${endpointPostfix ? endpointPostfix : ""}`
    }

    getAll = (token: string, endpointPostfix?: string): Promise<TGet[]> => {
        this._setAuthHeader(token)
        return axiosInstance.get<TGet[]>(this._getEndpoint(endpointPostfix)).then(res => res.data)
    }

    get = (token: string, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader(token)
        return axiosInstance.get<TGet>(this._getEndpoint(endpointPostfix)).then(res => res.data)
    }

    getAndPreProcess = <TOther>(
        token: string,
        handlePreProcess: (preData: TOther) => TGet, 
        endpointPostfix?: string
    ): Promise<TGet> => {
        this._setAuthHeader(token)
        return axiosInstance.get<TOther>(this._getEndpoint(endpointPostfix)).then(res => handlePreProcess(res.data))
    }

    post = (token: string, data: TPost, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader(token)
        return axiosInstance.post<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    postWithoutAuth = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
        return axiosInstance.post<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    postOther = <TPostOther>(token: string, data: TPostOther, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader(token)
        return axiosInstance.post<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    edit = (token: string, data: TPost, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader(token)
        return axiosInstance.patch<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    editOther = <TPostOther>(token: string, data: TPostOther, endpointPostfix?: string): Promise<TGet> => {
        this._setAuthHeader(token)
        return axiosInstance.patch<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    delete = (token: string, endpointPostfix?: string): Promise<string> => {
        this._setAuthHeader(token)
        return axiosInstance.delete(this._getEndpoint(endpointPostfix)).then(() => "Deleted successfully.")
    }
}

export default APIClient