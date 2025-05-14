"use client";
import { useLoadingOverlayAction } from "module/_core/app/component/AppModal/util";
import withAuth from "module/_core/app/component/Auth/withAuth";
import { AuthService } from "module/auth/domain/service/auth";
import Head from "next/head";
import { useGoogleLogin } from "@react-oauth/google";
import { showToast } from "@lib/component/Toast/Toast";
import { ToastType } from "@lib/component/Toast/type";
import Layout from "@module/_core/app/component/Layout";
import { useRouter, useSearchParams } from "next/navigation";

const LoginView = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams?.get("redirect");
    const { loginGoogleMutation } = AuthService.useAuthAction();

    const { openLoadingOverlay, closeLoadingOverlay } = useLoadingOverlayAction();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                openLoadingOverlay("Đang đang nhập...");
                if (tokenResponse) {
                    loginGoogleMutation.mutate(tokenResponse.access_token, {
                        onError: (error: any) => {
                            // errorHandler(error);
                            closeLoadingOverlay();
                        },
                        onSuccess: async () => {
                            await router.replace(redirect ?? "/");
                            closeLoadingOverlay();
                        }
                    });
                }
            } catch (e: any) {
                closeLoadingOverlay();
                showToast({
                    type: ToastType.ERROR,
                    description: e.message.toString()
                });
            }
        },
        onError: (error) => {
            showToast({
                type: ToastType.ERROR,
                description: "Đã xảy ra lỗi vui lòng thử lại"
            });
        }
    });

    return (
        <>
            <Head>
                <title>Login | mentorapp.com</title>
            </Head>

            <div className="relative bg-white pb-20 pt-[60px]">
                <div className="responsive-layout flex h-full min-h-[50vh] px-5 tab:px-0">
                    <div className="flex w-full flex-col items-center justify-center">
                        <p className="text-center text-2xl text-[28px] text-[#000] tab:text-start">
                            Login to Mentor App
                        </p>
                        <div
                            className="flex-center ml-[0.5px] mt-8 flex w-full cursor-pointer justify-center rounded-xs border-[0.5px] border-[#A8A8A8] py-3 tab:w-max tab:px-16"
                            onClick={() => handleGoogleLogin()}
                        >
                            <div className="flex">
                                <img src="/assets/images/social/login-google.png" alt="" className="h-6 w-6" />
                                <span className="ml-2 text-lg tab:text-md">Sign in with Google</span>
                            </div>
                        </div>
                        <div
                            className="flex-center ml-[0.5px] mt-8 flex w-full cursor-pointer justify-center rounded-xs border-[0.5px] border-[#A8A8A8] py-3 tab:w-max tab:px-16"
                            onClick={() => handleGoogleLogin()}
                        >
                            <div className="flex">
                                <img src="/assets/images/social/login-google.png" alt="" className="h-6 w-6" />
                                <span className="ml-2 text-lg tab:text-md">Sign in with Google</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuth(LoginView);
