"use client";

import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import Block from "module/_core/app/component/Block";
import ErrorEmpty from "module/_core/app/component/Empty/ErrorEmpty";
import MainTable from "module/_core/app/component/Table/MainTable";
import MainTag from "module/_core/app/component/Tag/MainTag";
import { AuthACP } from "module/auth/domain/config/accessControl/permission";
import { ACTION_TAG_COLOR } from "module/auth/domain/constant/permission";
import { IPermission } from "module/auth/domain/model/permission";
import { AuthService } from "module/auth/domain/service/auth";
import { PermissionService } from "module/auth/domain/service/permission";
import strings from "module/_core/infras/constant/strings";
import { isActive } from "module/_core/infras/util/entityState";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { displaySuccessNoti } from "module/_core/infras/util/notification";
import { Button, Popconfirm, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { ElementRef, useEffect, useRef } from "react";
import PermissionForm from "./PermissionForm";
import { HeaderService } from "@module/_core/app/layout/MainHeader/service";
import { BreadcrumbService } from "@module/_core/app/layout/MainBreadcrumb/service";
import { AppLoadingView } from "@module/_core/app/component/Loading/AppLoading";

const PermissionView = () => {
    const { setHeaderTitle } = HeaderService.useHeader(() => 0);
    const { setDefault } = BreadcrumbService.useBreadcrumb(() => 0);
    useEffect(() => {
        setHeaderTitle("Quản lý quyền");
        setDefault();
    }, []);
    const { verifyACP } = AuthService.useAuth();
    const { data, isPending, isFetching, isError } = PermissionService.usePermission({
        fetcherOptions: {
            staleTime: 0,
            gcTime: 0,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });

    const { deletePermissionMutation } = PermissionService.usePermissionAction();

    const permissionFormRef = useRef<ElementRef<typeof PermissionForm>>(null);

    const openCreateForm = () => {
        permissionFormRef.current?.openCreateForm();
    };

    const openUpdateForm = (permissionData: IPermission) => {
        permissionFormRef.current?.openUpdateForm(permissionData);
    };

    const handleDeletePermission = (permissionId: number) => {
        return new Promise((resolve) => {
            deletePermissionMutation.mutate(permissionId, {
                onSuccess: () => {
                    displaySuccessNoti({ description: "Xóa tài nguyên thành công!" });
                    resolve(null);
                },
                onError: (error) => {
                    errorHandler(error);
                }
            });
        });
    };

    const columns: ColumnsType<IPermission> = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            align: "center",
            fixed: true,
            render: (_, { id }) => <span>{data && data.findIndex((ele) => id === ele.id) + 1}</span>
        },
        {
            title: "Tên tài nguyên",
            dataIndex: "resourceName"
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, { actions }) => (
                <div className="flex gap-x-0.5 gap-y-2 flex-wrap">
                    {actions.map(({ action, actionName, status }, index) => (
                        <MainTag
                            key={index}
                            color={ACTION_TAG_COLOR[action] ?? "default"}
                            style={{ opacity: isActive(status) ? "100%" : "30%" }}
                        >
                            {actionName ? actionName : (strings[action] ?? action)}
                        </MainTag>
                    ))}
                </div>
            )
        },
        // {
        //     title: "NGÀY CẬP NHẬT",
        //     dataIndex: "updatedAt",
        //     render: (value) => formatTableTimeString(value)
        // },
        {
            title: "",
            key: "actions",
            width: 70,
            render: (_, record) => (
                <div className="flex flex-col tab:flex-row items-center gap-2">
                    {verifyACP(AuthACP.UpdatePermission) && (
                        <Tooltip color="#074173" placement="bottom" title="Chỉnh sửa quyền">
                            <div className="table-action-primary-btn" onClick={() => openUpdateForm(record)}>
                                <EditOutlined />
                            </div>
                        </Tooltip>
                    )}
                    {verifyACP(AuthACP.DeletePermission) && (
                        <Popconfirm
                            title="Xóa tài nguyên?"
                            onConfirm={() => handleDeletePermission(record.id)}
                            okButtonProps={{ loading: deletePermissionMutation.isPending }}
                            okText={strings.confirm}
                            cancelText={strings.cancel}
                        >
                            <Tooltip color="#F25C5F" placement="bottom" title="Xoá danh mục">
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
                    <div className="flex justify-end mb-5 px-4 lap:px-1">
                        {verifyACP(AuthACP.CreatePermission) && (
                            <Button type="primary" className="py-1.5" onClick={openCreateForm}>
                                Thêm tài nguyên
                            </Button>
                        )}
                    </div>
                    <MainTable
                        scroll={{ x: "max-content" }}
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        loading={isFetching}
                    />
                </div>
            ) : null}
            {isError && <ErrorEmpty />}
            <PermissionForm ref={permissionFormRef} />
        </Block>
    );
};

export default PermissionView;
