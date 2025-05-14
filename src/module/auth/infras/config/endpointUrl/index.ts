import { MentorAppEndpoint } from "@module/_core/infras/config/endpointUrl/mentorApp";

export class AuthEndpoint extends MentorAppEndpoint {
    static auth = () => `${MentorAppEndpoint.base}/v1/auth/me`;
    static login = () => `${MentorAppEndpoint.base}/v1/login`;
    static register = () => `${MentorAppEndpoint.base}/v1/register`;
    static refreshToken = () => `${MentorAppEndpoint.base}/v1/refresh-token`;
    static logout = () => `${MentorAppEndpoint.base}/v1/logout`;
    static login_google = () => `${MentorAppEndpoint.base}/v1/auth/google`;
}
