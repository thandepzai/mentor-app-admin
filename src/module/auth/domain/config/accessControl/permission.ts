import { PermissionAuth } from "../type/authOption";

export class BaseACP {
    protected static ACTION_CREATE = "create";
    protected static ACTION_UPDATE = "update";
    protected static ACTION_READ = "read";
    protected static ACTION_DELETE = "delete";

    protected static p = (resource: string, action: string): PermissionAuth => ({
        resource: resource,
        action: action
    });
}

export class AuthACP extends BaseACP {
    static RESOURCE_USER = "user";
    static RESOURCE_ROLE = "role";
    static RESOURCE_PERMISSION = "permission";
    static RESOURCE_AUTH = "auth";
    static RESOURCE_INTERACTION = "interaction";

    // User
    static CreateUser = this.p(this.RESOURCE_USER, this.ACTION_CREATE);
    static ReadUser = this.p(this.RESOURCE_USER, this.ACTION_READ);
    static UpdateUser = this.p(this.RESOURCE_USER, this.ACTION_UPDATE);
    static DeleteUser = this.p(this.RESOURCE_USER, this.ACTION_DELETE);

    // Role
    static CreateRole = this.p(this.RESOURCE_ROLE, this.ACTION_CREATE);
    static ReadRole = this.p(this.RESOURCE_ROLE, this.ACTION_READ);
    static UpdateRole = this.p(this.RESOURCE_ROLE, this.ACTION_UPDATE);
    static DeleteRole = this.p(this.RESOURCE_ROLE, this.ACTION_DELETE);

    // Permission
    static CreatePermission = this.p(this.RESOURCE_PERMISSION, this.ACTION_CREATE);
    static ReadPermission = this.p(this.RESOURCE_PERMISSION, this.ACTION_READ);
    static UpdatePermission = this.p(this.RESOURCE_PERMISSION, this.ACTION_UPDATE);
    static DeletePermission = this.p(this.RESOURCE_PERMISSION, this.ACTION_DELETE);

    // Dev
    static ShowDevPage = this.p(this.RESOURCE_AUTH, "dev");

    //Interaction
    static ReadInteraction = this.p(this.RESOURCE_INTERACTION, this.ACTION_READ);
    static UpdateInteraction = this.p(this.RESOURCE_INTERACTION, this.ACTION_UPDATE);
    static DeleteInteraction = this.p(this.RESOURCE_INTERACTION, this.ACTION_DELETE);
}
