"use client";

import MainForm from "module/_core/app/component/Form/MainForm";
import { AuthService } from "module/auth/domain/service/auth";
import strings from "module/_core/infras/constant/strings";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { Button, Form, Input } from "antd";
import { AppLoadingViewOverlay } from "@module/_core/app/component/Loading/AppLoading";
import { useRouter, useSearchParams } from "next/navigation";

interface LoginFormData {
    username: string;
    password: string;
}

const LoginView = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams?.get("redirect");
    const { loginMutation } = AuthService.useAuthAction();

    const handleSubmit = async (values: LoginFormData) => {
        loginMutation.mutate(
            {
                username: values.username,
                password: values.password
            },
            {
                onError: (error: any) => {
                    errorHandler(error);
                },
                onSuccess: async () => {
                    router.replace((redirect as string) ?? "/");
                }
            }
        );
    };

    return (
        <div className="absolute inset-0 flex-center">
            <MainForm name="loginForm" onFinish={handleSubmit}>
                <div className="flex items-center text-secondary-typo tabx:px-10 lap:px-40">
                    <div className="hidden tabx:flex flex-col justify-center items-center basis-1/2 lap:pr-32 border-r-[1px] border-r-[#DCECFC]">
                        <div className="w-full mb-8">
                            <h2 className="text-[2.5rem] font-bold mb-2">Chào mừng trở lại</h2>
                            <p className="text-md w-80">
                                Học tập và giao lưu với hàng triệu học viên trên mọi miền đất nước.
                            </p>
                        </div>
                        <img src="/images/study.png" alt="" className="w-full" />
                    </div>
                    <div className="w-full basis-1/2 tabx:pl-14 lap:pl-32 flex flex-col flex-center min-w-[350px]">
                        <h3 className="text-2xl font-semibold mb-8 uppercase">Đăng nhập</h3>
                        <Form.Item
                            name="username"
                            label="Tên đăng nhập"
                            className="w-full"
                            rules={[{ required: true, message: strings.input_required_error }]}
                        >
                            <Input placeholder="Tên đăng nhập" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            className="w-full"
                            rules={[{ required: true, message: strings.input_required_error }]}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" className="px-10 py-3 mb-8 !bg-primary !h-min">
                            Đăng nhập
                        </Button>
                    </div>
                </div>
            </MainForm>
            {loginMutation.isPending ? (
                <AppLoadingViewOverlay title="Đang đăng nhập..." titleClassName="text-white" />
            ) : null}
        </div>
    );
};

export default LoginView;
