import { toast } from 'react-toastify';

import APIClient, {APIClientError} from '../services/apiClient';

const apiClient = new APIClient<string, string>("/")

const useFetchFile = () => {

    const downloadCSV = (data: string, fileName: string) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    const saveZIPToFile = (data: Blob | ArrayBuffer, fileName: string) => {
        const blob = new Blob([data], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName
        a.click();
        window.URL.revokeObjectURL(url);
      }

    return (path: string) => {
        if (path === "runways/csv") {
            apiClient.getZip(path)
            .then(res => {
                saveZIPToFile(res.data, res.headers.filename)
            })
            .catch(err => {
                const error = err as APIClientError
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
            })
        } else {
            apiClient.getCsvFile(path)
                .then(res => {
                    downloadCSV(res.data, res.headers.filename)
                })
                .catch(err => {
                    const error = err as APIClientError
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
                })
        }
    }
}

export default useFetchFile
