import { ISuccessResponse } from "module/_core/infras/config/type/apiReponse";

export interface ExtraDataDto {
    roles: any[];
    permissions: any[];
    cities: any[];
}

export type GetExtraDataDTO = ISuccessResponse<ExtraDataDto>;

interface BaseExtraField {
    select?: string[];
}

export interface FilterExtraDataDto {
    role?: BaseExtraField | true;
    permission?: BaseExtraField | true;
    city?: BaseExtraField | true;
}
