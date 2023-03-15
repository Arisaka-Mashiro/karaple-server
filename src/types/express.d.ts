// ./src/types/express.d.ts
import { User } from '../models/User';

declare global {
	namespace Express {
		interface User {
			provider: string;
			providerId: string;
			name: string;
			email: string;
			accessToken: string;
			refreshToken: string;
			googleAccessToken: string;
		}
	}
}