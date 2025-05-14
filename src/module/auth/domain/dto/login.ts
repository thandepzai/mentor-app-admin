import { ISuccessResponse } from "module/_core/infras/config/type/apiReponse";
import { MeDTO } from "./me";

export interface LoginDTO {
    username: string;
    password: string;
}

export type LoginResponseDTO = ISuccessResponse<{
    user: MeDTO;
    accessToken: string;
}>;
