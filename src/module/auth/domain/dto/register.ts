import { ISuccessResponse } from "module/_core/infras/config/type/apiReponse";
import { Gender } from "../config/type/gender";
import { MeDTO } from "./me";

// Register
export interface RegisterDTO {
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    gender?: Gender;
    yearOfBirth: number;
    linkFacebook: string;
    cityId: number;
    schoolId: number;
}

export type RegisterResponseDTO = ISuccessResponse<{ user: MeDTO }>;
