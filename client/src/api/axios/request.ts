import axios from 'axios';

const request = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});


request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Or use cookies if needed
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default request;
