import { AuthService } from '@/services/auth.service.js';
import { CookiesService } from '@/services/cookies.service.js';

export async function initialFetchData(cb = () => {}) {
	if (import.meta.env.MODE === 'development') {
		const authService = new AuthService();

		if (!CookiesService.getToken()) {
			await authService.login();
		}
	}

	await cb();
}
