import { IFetcherOptions, useFetcher } from "@module/_core/infras/hook/useFetcher";
import {
    AddCoursesToUserDTO,
    CourseOfUserDTO,
    CoursesOfUserFilterDTO,
    RemoveCoursesOfUserDTO
} from "../dto/courseOfUser";
import { CourseOfUserApi } from "../api/courseOfUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseCourseOfUserOptions {
    filter?: CoursesOfUserFilterDTO;
    fetcherOptions?: IFetcherOptions<{ courses: CourseOfUserDTO[] }>;
}

export class CourseOfUserService {
    static COURSE_OF_USER_KEY = "COURSE_OF_USER";

    static useCourseOfUser = (userId: number, { filter = {}, fetcherOptions = {} }: UseCourseOfUserOptions = {}) => {
        const { data, isPending, isFetching, isError, error } = useFetcher(
            [this.COURSE_OF_USER_KEY, userId, filter],
            () => CourseOfUserApi.getCoursesOfUser(userId, filter),
            fetcherOptions
        );

        return {
            data,
            isPending,
            isFetching,
            isError,
            error
        };
    };

    static useCourseOfUserAction = () => {
        const queryClient = useQueryClient();

        const addCoursesToUserMutation = useMutation({
            mutationFn: ({ userId, body }: { userId: number; body: AddCoursesToUserDTO }) =>
                CourseOfUserApi.addCoursesToUser({ userId, body }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [this.COURSE_OF_USER_KEY] });
            }
        });

        const removeCoursesOfUserMutation = useMutation({
            mutationFn: ({ userId, body }: { userId: number; body: RemoveCoursesOfUserDTO }) =>
                CourseOfUserApi.removeCoursesOfUser({ userId, body }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [this.COURSE_OF_USER_KEY] });
            }
        });

        return {
            addCoursesToUserMutation,
            removeCoursesOfUserMutation
        };
    };
}
