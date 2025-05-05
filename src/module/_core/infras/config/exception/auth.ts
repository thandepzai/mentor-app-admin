import Exception from "lib/exception/Exception";

export class AuthException extends Exception {
    constructor() {
        super(401, "Authenication token missing");
    }
}
