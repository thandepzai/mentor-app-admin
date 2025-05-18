import { MentorAppEndpoint } from "module/_core/infras/config/endpointUrl/mentorApp";

export class AuthEndpoint extends MentorAppEndpoint {
    // auth
    static auth = () => `${this.baseAdmin}/v1/auth/me`;
    static login = () => `${this.baseAdmin}/v1/login`;
    static refreshToken = () => `${this.baseAdmin}/v1/refresh-token`;
    static logout = () => `${this.baseAdmin}/v1/logout`;

    // role
    static getRoles = () => `${this.baseAdmin}/v1/role`;
    static createRole = () => `${this.baseAdmin}/v1/role`;
    static getOneRole = (roleId: number) => `${this.baseAdmin}/v1/role/${roleId}`;
    static updateRole = (roleId: number) => `${this.baseAdmin}/v1/role/${roleId}`;
    static deleteRole = (roleId: number) => `${this.baseAdmin}/v1/role/${roleId}`;

    // permossion
    static getPermissions = () => `${this.baseAdmin}/v1/permission`;
    static createPermission = () => `${this.baseAdmin}/v1/permission`;
    static updatePermission = (permissionId: number) => `${this.baseAdmin}/v1/permission/${permissionId}`;
    static deletePermission = (permissionId: number) => `${this.baseAdmin}/v1/permission/${permissionId}`;

    // Extradata
    static getExtraData = () => `${this.baseAdmin}/v1/extra-data`;
}
