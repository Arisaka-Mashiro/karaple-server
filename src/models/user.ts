export interface User {
    provider: string;
    providerId: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    googleAccessToken: string;
}