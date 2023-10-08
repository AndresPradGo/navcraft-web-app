import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000'
})

class APIClient<TGet, TPost> {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    _getEndpoint = (endpointPostfix?: string): string => {
        return `${this.endpoint}${endpointPostfix ? endpointPostfix : ""}`
    }

    getAll = (endpointPostfix?: string): Promise<TGet[]> => {
        return axiosInstance.get<TGet[]>(this._getEndpoint(endpointPostfix)).then(res => res.data)
    }

    get = (endpointPostfix?: string): Promise<TGet> => {
        return axiosInstance.get<TGet>(this._getEndpoint(endpointPostfix)).then(res => res.data)
    }

    create = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
        return axiosInstance.post<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    edit = (data: TPost, endpointPostfix?: string): Promise<TGet> => {
        return axiosInstance.patch<TGet>(this._getEndpoint(endpointPostfix), data).then(res => res.data)
    }

    delete = (endpointPostfix?: string): Promise<string> => {
        return axiosInstance.delete(this._getEndpoint(endpointPostfix)).then(() => "Deleted successfully.")
    }
}

export default APIClient