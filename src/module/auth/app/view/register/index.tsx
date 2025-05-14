import AppButton from "module/_core/app/component/Button/AppButton";
import { AuthService } from "module/auth/domain/service/auth";
import { MeService } from "module/auth/domain/service/me";
import { CityService } from "module/common/domain/service/city";
import { SchoolService } from "module/common/domain/service/school";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import RegisterFormItem from "./RegisterFormItem";
import { useLoadingOverlayAction } from "module/_core/app/component/AppModal/util";
import withAuth from "module/_core/app/component/Auth/withAuth";
import { Gender } from "module/auth/domain/config/type/gender";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { showToast } from "lib/component/Toast/Toast";
import { ToastType } from "lib/component/Toast/type";
import Head from "next/head";
import { useRouter } from "next/router";

interface RegisterFormData {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    gender: string;
    yearOfBirth: number;
    linkFacebook: string;
    cityId: number;
    schoolId: number;
}

const RegisterView = () => {
    const router = useRouter();

    const { registerMutation } = AuthService.useAuthAction();
    // useLoadingStateAction({ loading: registerMutation.isPending, title: "Đang đăng ký..." });
    const { openLoadingOverlay, closeLoadingOverlay } = useLoadingOverlayAction();

    const { handleSubmit, control, watch } = useForm<RegisterFormData>({
        // defaultValues: {
        //     name: "Người dùng 1",
        //     username: "nguoidung1",
        //     password: "123456",
        //     confirmPassword: "123456",
        //     email: "nguoidung1@gmail.com",
        //     phone: "0999111222",
        //     gender: Gender.MALE,
        //     yearOfBirth: 2001,
        //     linkFacebook: "https://www.facebook.com/nta284/",
        //     cityId: 1,
        //     schoolId: 1
        // }
    });

    const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
        openLoadingOverlay();

        const { name, username, password, email, phone, gender, yearOfBirth, linkFacebook, cityId, schoolId } = data;
        registerMutation.mutate(
            {
                name,
                username,
                password,
                email,
                phone,
                gender: gender as Gender,
                yearOfBirth: parseInt(yearOfBirth as unknown as string),
                linkFacebook,
                cityId,
                schoolId
            },
            {
                onSuccess: async () => {
                    showToast({
                        type: ToastType.SUCCESS,
                        title: "Đăng kí thành công",
                        description: "Vui lòng đăng nhập để tiếp tục sử dụng !"
                    });
                    await router.push("/dang-nhap");
                    closeLoadingOverlay();
                },
                onError: (error) => {
                    errorHandler(error);
                    closeLoadingOverlay();
                }
            }
        );
    };

    return (
        <>
            <Head>
                <title>Đăng ký | Mapstudy.edu.vn</title>
            </Head>
            <img
                src="/assets/images/common/blur.png"
                alt=""
                className="absolute hidden w-[600px] tab:block lap:left-[8%] lap:w-[750px]"
            />
            <div className="relative bg-[rgba(255,255,255,0.8)]">
                <div className="responsive-layout -mb-6 py-12 tab:py-16 lap:py-20">
                    <div className="flex flex-col items-center px-6 text-secondary-typo tab:px-0 lap:flex-row lap:px-16 lapx:px-0">
                        <div className="hidden flex-col items-center justify-center border-r-[#DCECFC] lap:flex lap:basis-1/2 lap:pr-16 lapx:pr-32">
                            <div className="mb-8 w-full">
                                <h2 className="mb-2 text-[2.5rem] font-bold">Tạo tài khoản</h2>
                                <p className="w-80 text-md opacity-70">
                                    Học tập và giao lưu với hàng triệu học viên trên mọi miền đất nước.
                                </p>
                            </div>
                            <img src="/assets/images/common/study.png" alt="" className="w-full" />
                        </div>
                        <div className="flex-center flex w-full flex-col lap:basis-1/2 lap:border-l-[1px] lap:pl-16 lapx:pl-32">
                            <h3 className="mb-8 text-2xl font-semibold uppercase">Đăng ký</h3>
                            <form className="flex-center mb-10 flex w-full flex-col" onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-10 flex w-full flex-col gap-5">
                                    <Controller
                                        control={control}
                                        name="name"
                                        rules={{ required: true }}
                                        render={({ field, fieldState: { error } }) => (
                                            <RegisterFormItem label="Họ và tên" required field={field} error={error} />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="username"
                                        rules={{
                                            required: true,
                                            pattern: {
                                                value: /^[0-9A-Za-z_]*$/,
                                                message: "Tên tài khoản viết liền, không dấu, không chứa kí tự đặc biệt"
                                            },
                                            minLength: { value: 6, message: "Tên tài khoản phải có ít nhất 6 ký tự" },
                                            maxLength: { value: 18, message: "Tên tài khoản chỉ tối đa 18 ký tự" }
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <RegisterFormItem
                                                label="Tên tài khoản"
                                                required
                                                field={field}
                                                error={error}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="password"
                                        rules={{
                                            required: true,
                                            minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <RegisterFormItem
                                                label="Mật khẩu"
                                                type="password"
                                                required
                                                field={field}
                                                error={error}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="confirmPassword"
                                        rules={{
                                            required: "Vui lòng nhập lại mật khẩu",
                                            validate: (value, formValues) =>
                                                value === formValues.password || "Mật khẩu không trùng khớp"
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <RegisterFormItem
                                                label="Xác nhận lại mật khẩu"
                                                type="password"
                                                required
                                                field={field}
                                                error={error}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="email"
                                        rules={{ required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi }}
                                        render={({ field, fieldState: { error } }) => (
                                            <RegisterFormItem label="Email" required field={field} error={error} />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="phone"
                                        rules={{
                                            required: true,
                                            pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g
                                        }}
                                        render={({ field, fieldState: { error } }) => (
                                            <RegisterFormItem
                                                label="Số điện thoại"
                                                required
                                                field={field}
                                                error={error}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="gender"
                                        render={({ field, fieldState: { error } }) => (
                                            <RegisterFormItem
                                                label="Giới tính"
                                                type="select"
                                                options={Object.entries(MeService.genderMapName).map(
                                                    ([key, value]) => ({
                                                        value: key,
                                                        label: value
                                                    })
                                                )}
                                                field={field}
                                                error={error}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="yearOfBirth"
                                        rules={{ required: true, pattern: /\b(19|20)\d\d\b/g }}
                                        render={({ field, fieldState: { error } }) => (
                                            <RegisterFormItem label="Năm sinh" required field={field} error={error} />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="linkFacebook"
                                        rules={{ required: true }}
                                        render={({ field, fieldState: { error } }) => (
                                            <RegisterFormItem
                                                label="Link Facebook"
                                                required
                                                field={field}
                                                error={error}
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="cityId"
                                        rules={{ required: "Vui lòng chọn Tỉnh thành" }}
                                        render={({ field, fieldState: { error } }) => {
                                            const cityData = CityService.useCity({
                                                fetcherOptions: {
                                                    staleTime: 0,
                                                    gcTime: 0
                                                }
                                            });
                                            return (
                                                <RegisterFormItem
                                                    label="Tỉnh thành"
                                                    type="selectWithSearch"
                                                    options={cityData.data?.map(({ id, name }) => ({
                                                        value: id,
                                                        label: name
                                                    }))}
                                                    required
                                                    field={field}
                                                    error={error}
                                                />
                                            );
                                        }}
                                    />
                                    <Controller
                                        control={control}
                                        name="schoolId"
                                        rules={{ required: "Vui lòng chọn Trường học" }}
                                        render={({ field, fieldState: { error } }) => {
                                            const cityId = watch("cityId");
                                            const schoolData = SchoolService.useSchool(cityId, {
                                                fetcherOptions: {
                                                    staleTime: 0,
                                                    gcTime: 0,
                                                    enabled: !!cityId
                                                }
                                            });

                                            return (
                                                <RegisterFormItem
                                                    label="Trường học"
                                                    type="selectWithSearch"
                                                    options={schoolData.data?.map(({ id, name }) => ({
                                                        value: id,
                                                        label: name
                                                    }))}
                                                    required
                                                    field={field}
                                                    error={error}
                                                />
                                            );
                                        }}
                                    />
                                </div>
                                <AppButton htmlType="submit" className="px-10 py-3">
                                    Tạo tài khoản
                                </AppButton>
                            </form>
                            <div className="text-base">
                                <span>Đã có tài khoản? </span>
                                <Link href="/dang-nhap" className="hover:text-gray-900">
                                    Đăng nhập
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(RegisterView);
