/**
 * @file 网络请求
 */

import axios from 'axios';

export const createHttp = () => {
    const http = axios.create({
        baseURL: '/',
        timeout: 50 * 60 * 1000
    });
    http.interceptors.request.use(req => req);
    http.interceptors.response.use(res => res, err => err);
    return http;
};

export default createHttp();
