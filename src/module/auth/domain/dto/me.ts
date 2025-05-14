import { EntityState } from "module/_core/infras/config/type/entityState";
import { Gender } from "../config/type/gender";
import { ISuccessResponse } from "module/_core/infras/config/type/apiReponse";
export interface MeDTO {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    gender: Gender;
    yearOfBirth: number;
    linkFacebook: string;
    avatar: string;
    avatarHash: string;
    city: {
        id: number;
        name: string;
        slug: string;
    };
    school: {
        id: number;
        name: string;
        cityId: number;
    };
    status: EntityState;
    createdAt: string;
    updatedAt: string;
}

export type GetMeDTO = ISuccessResponse<{ user: MeDTO }>;
