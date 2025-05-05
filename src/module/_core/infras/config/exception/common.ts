import Exception from "lib/exception/Exception";

export class CommonException extends Exception {
    constructor() {
        super(100, "Error");
    }
}
