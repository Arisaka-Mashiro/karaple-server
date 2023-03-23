// ./src/types/express/index.d.ts
import { User } from '../../models/user';

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
		interface Request {
			user: User
		}
	}
}