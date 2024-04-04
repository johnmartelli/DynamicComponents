import axios from 'axios';

import { CookiesService } from '@/services/cookies.service.js';
import { FiltersService } from '@/services/filters.service.js';
import { AuthService } from '@/services/auth.service.js';

const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || ''
};

const authService = new AuthService();

class Api {
    constructor(config) {
        this.instance = axios.create(config);
        this.instance.interceptors.response.use(this.onResponse, this.onRejected);
        this.instance.interceptors.request.use(this.onRequest);
    }

    async onRequest(params) {
        const localParams = params;

        if (CookiesService.getToken()) {
            localParams.headers.token = CookiesService.getToken();
        }

        return localParams;
    }

    onResponse(response) {
        return Promise.resolve(response.data);
    }

    onRejected = async (error) => {
        if (import.meta.env.MODE === 'development' && error.response.status === 403) {
            await authService.login();
        }

        return Promise.reject(error.response);
    }

    get(apiUrl, filters = [], params = {}, headers = {}, isStructure = false) {
        const preparedFilters = filters.length ? FiltersService.getPreparedRequestFiltersParams(filters) : {};
        const structure = isStructure ? { structure: true } : {};
        return this.instance.get(apiUrl, {
            params: {
                ...preparedFilters,
                ...structure,
                ...params,
            },
            headers: {
                ...headers,
                noapiproduct: true,
                environment: 'Frontend'
            }
        });
    }

    put(apiUrl, data = [], headers = {}, isStructure = false) {
        return this.instance.put(apiUrl, { data }, { headers });
    }

    // get(url, data) {
    //     return this.instance.get(url, { params: data });
    // }
    //
    // post(url: string, data?: any, config?: object): any {
    //     return this.instance({
    //         method: 'post',
    //         url: url,
    //         data,
    //         ...config
    //     });
    // }
    //
    // put(url: string, data?: any): any {
    //     return this.instance({
    //         method: 'put',
    //         url: url,
    //         data
    //     });
    // }
    //
    // patch(url: string, data?: any): any {
    //     return this.instance({
    //         method: 'patch',
    //         url: url,
    //         data
    //     });
    // }
    //
    // delete(url: string, data?: any, config?: object): any {
    //     return this.instance({
    //         method: 'delete',
    //         url: url,
    //         data,
    //         ...config
    //     });
    // }
}

const api = new Api(API_CONFIG);

export {
    api
};
