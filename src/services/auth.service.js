import { CookiesService } from '@/services/cookies.service.js';
import { api } from '@/services/api.service.js';

class AuthService {
	/**
	 * Method to login and set cookie tokens
	 */
	async login() {
		try {
			// dev ENV
			const apiUrlGetToken = 'https://platform.dev.altamiraweb.com/api/v3/REST/authentication/getToken';
			// next ENV
			// const apiUrlGetToken = 'https://platform.next.altamiraweb.com/api/v3/REST/authentication/getToken';
			const headers = {
				// Username: 'testdevf@yopmail.com',
				Username: 'mar1m@yopmail.com',
				Password: 'ciao',
				LoginRequest: '1',
				structure: 'false'
			};
			const { data = [] } = await api.get(apiUrlGetToken, [], {}, headers);
            const [responseData] = data;
            const { token, refreshToken } = responseData;
            CookiesService.setToken(token);
            CookiesService.setRefreshToken(refreshToken);
            return Promise.resolve(responseData);
		} catch (error) {
            return Promise.reject(error);
		}
	}
}

export {
    AuthService
};
