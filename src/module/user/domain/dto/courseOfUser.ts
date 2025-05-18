import { ISuccessResponse } from "@module/_core/infras/config/type/apiReponse";
import { CourseDTO } from "@module/course/domain/dto/course";

export interface CoursesOfUserFilterDTO {
    name?: string;
    page?: number;
    pageSize?: number;
}

export interface CourseOfUserDTO extends CourseDTO {}

export type GetCoursesOfUserDTO = ISuccessResponse<{ courses: CourseOfUserDTO[] }>;

export interface AddCoursesToUserDTO {
    courseIds: number[];
}

export interface RemoveCoursesOfUserDTO {
    courseIds: number[];
}
