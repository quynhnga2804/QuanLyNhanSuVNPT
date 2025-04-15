import axiosClient from './axiosClient';

export const get = (url) => axiosClient.get(url);
export const post = (url, data) => axiosClient.post(url, data);
export const put = (url, data) => axiosClient.put(url, data);
export const del = (url) => axiosClient.delete(url);
export const login = (url, email, password) => {
    return axiosClient.post(url, { email, password });
};
export const verify = (url, token, otp) => {
    return axiosClient.post(url, { token, otp });
};

export const sendotp = (url, email, tokenA) => {
    return axiosClient.post(url, { email, tokenA });
};
