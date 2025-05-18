"use client";

import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Block from "module/_core/app/component/Block";
import ErrorEmpty from "module/_core/app/component/Empty/ErrorEmpty";
import MainTable from "module/_core/app/component/Table/MainTable";
import StatusTag from "module/_core/app/component/Tag/StatusTag";
import { AuthACP } from "module/auth/domain/config/accessControl/permission";
import { IRole } from "module/auth/domain/model/role";
import { AuthService } from "module/auth/domain/service/auth";
import { RoleService } from "module/auth/domain/service/role";
import strings from "module/_core/infras/constant/strings";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { displaySuccessNoti } from "module/_core/infras/util/notification";
import { Button, Checkbox, Popconfirm, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { HeaderService } from "@module/_core/app/layout/MainHeader/service";
import { useEffect } from "react";
import { BreadcrumbService } from "@module/_core/app/layout/MainBreadcrumb/service";
import { AppLoadingView } from "@module/_core/app/component/Loading/AppLoading";

const RoleView = () => {
    const { setHeaderTitle } = HeaderService.useHeader(() => 0);
    const { setDefault } = BreadcrumbService.useBreadcrumb(() => 0);
    useEffect(() => {
        setHeaderTitle("Chức vụ");
        setDefault();
    }, []);
    const { verifyACP } = AuthService.useAuth();
    const { data, isPending, isFetching, isError } = RoleService.useRole({
        fetcherOptions: {
            staleTime: 0,
            gcTime: 0,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });

    const { deleteRoleMutation } = RoleService.useRoleAction();

    const handleDeleteRole = (roleId: number) => {
        return new Promise((resolve) => {
            deleteRoleMutation.mutate(roleId, {
                onSuccess: () => {
                    displaySuccessNoti({ description: "Xóa chức vụ thành công!" });
                    resolve(undefined);
                },
                onError: (error) => {
                    errorHandler(error);
                }
            });
        });
    };

    const columns: ColumnsType<IRole> = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            align: "center",
            render: (_, { id }) => <span>{data && data.findIndex((ele) => id === ele.id) + 1}</span>
        },
        {
            title: "Tên",
            dataIndex: "name",
            render: (name, { id }) => (
                <Link href={`/role/${id}`} className="text-ant-primary">
                    {name}
                </Link>
            )
        },
        {
            title: "Đăng ký mặc định",
            dataIndex: "defaultSignUp",
            render: (value) => <Checkbox checked={value} />
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (value) => <StatusTag status={value} />
        },
        {
            title: "",
            key: "actions",
            width: 70,
            render: (_, { id }) => (
                <div className="flex flex-col tab:flex-row items-center gap-3">
                    <Link href={`/role/${id}`}>
                        <Tooltip color="#074173" placement="bottom" title="Chi tiết">
                            <div className="table-action-primary-btn">
                                <InfoCircleOutlined />
                            </div>
                        </Tooltip>
                    </Link>
                    {verifyACP(AuthACP.DeleteRole) && (
                        <Popconfirm
                            title="Xóa chức vụ?"
                            onConfirm={() => handleDeleteRole(id)}
                            okButtonProps={{ loading: deleteRoleMutation.isPending }}
                            okText={strings.confirm}
                            cancelText={strings.cancel}
                        >
                            <Tooltip color="#F25C5F" placement="bottom" title="Xoá chức vụ">
                                <div className="table-action-error-btn">
                                    <CloseOutlined />
                                </div>
                            </Tooltip>
                        </Popconfirm>
                    )}
                </div>
            )
        }
    ];

    return (
        <Block>
            {isPending ? (
                <AppLoadingView containerClassName="h-[60vh]" />
            ) : data ? (
                <div className="table-container">
                    <div className="flex justify-end mb-5 px-4 tab:px-1">
                        {verifyACP(AuthACP.CreateRole) && (
                            <Link href="/role/create">
                                <Button type="primary" className="py-1.5">
                                    Tạo chức vụ mới
                                </Button>
                            </Link>
                        )}
                    </div>
                    <MainTable
                        scroll={{ x: "max-content" }}
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        loading={isPending || isFetching}
                    />
                </div>
            ) : null}
            {isError && <ErrorEmpty />}
        </Block>
    );
};

export default RoleView;
