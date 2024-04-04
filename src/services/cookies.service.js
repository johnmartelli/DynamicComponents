import Cookies from 'js-cookie';

import { TOKEN_NAMES } from '@/constants/tokenNames';

class CookiesService {
	static getToken() {
		return Cookies.get(TOKEN_NAMES.TOKEN);
	}

	static setToken(token = '') {
		return Cookies.set(TOKEN_NAMES.TOKEN, token);
	}

	static removeToken() {
		return Cookies.remove(TOKEN_NAMES.TOKEN);
	}

	static getRefreshToken() {
		return Cookies.get(TOKEN_NAMES.REFRESH_TOKEN);
	}

	static setRefreshToken(token = '') {
		return Cookies.set(TOKEN_NAMES.REFRESH_TOKEN, token);
	}

	static removeRefreshToken() {
		return Cookies.remove(TOKEN_NAMES.REFRESH_TOKEN);
	}
}

export {
	CookiesService
};
