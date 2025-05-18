"use client";

import Block from "@module/_core/app/component/Block";
import ErrorEmpty from "@module/_core/app/component/Empty/ErrorEmpty";
import MainTabs from "@module/_core/app/component/Tabs/MainTabs";
import { errorHandler } from "@module/_core/infras/util/exceptionHandler";
import { UserService } from "@module/user/domain/service/user";
import { ElementRef, useRef, useState } from "react";
import { AppLoadingView, AppLoadingViewOverlay } from "@module/_core/app/component/Loading/AppLoading";
import UserForm from "../../components/UserForm";
import { displaySuccessNoti } from "@module/_core/infras/util/notification";
import { Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import UserSummary from "../../components/UserSummary";
import { useParams } from "next/navigation";

const UserDetailView = () => {
    const { userId } = useParams() || {};

    const { data, isPending, isFetching, isError } = UserService.useUserDetail(parseInt(userId as string), {
        fetcherOptions: {
            staleTime: 0,
            gcTime: 0,
            enabled: !!userId,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const userFormRef = useRef<ElementRef<typeof UserForm>>(null);

    const handleUpdateUser = () => {
        userFormRef.current?.handleSubmit({
            isSubmitting: (status) => setIsSubmitting(status),
            submitSuccess: () => {
                displaySuccessNoti({ description: "Cập nhật người dùng thành công" });
            }
        });
    };
    return (
        <Block>
            <UserSummary />
            <MainTabs
                itemTabs={[
                    { title: "Thông tin học sinh" },
                    { title: "Danh sách khoá học", href: `/user/${userId}/course` },
                    { title: "Vật phẩm", href: `/user/${userId}/item` }
                ]}
                className="mb-8"
            />
            {isPending ? (
                <AppLoadingView containerClassName="h-[30vh]" />
            ) : data ? (
                <div className="relative responsive-form">
                    {isFetching && <AppLoadingViewOverlay backDropClassName="!bg-[rgb(255,255,255,0.6)]" />}
                    <UserForm ref={userFormRef} userData={data} />
                    <div className="mt-6 w-full flex justify-end">
                        <Button
                            type="primary"
                            onClick={handleUpdateUser}
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="flex-center py-1.5"
                        >
                            <SaveOutlined />
                            Cập nhật User
                        </Button>
                    </div>
                </div>
            ) : null}
            {isError && <ErrorEmpty />}
        </Block>
    );
};

export default UserDetailView;
