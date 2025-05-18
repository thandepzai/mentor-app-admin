"use client";

import Block from "module/_core/app/component/Block";
import ErrorEmpty from "module/_core/app/component/Empty/ErrorEmpty";
import MainForm from "module/_core/app/component/Form/MainForm";
import MainTable from "module/_core/app/component/Table/MainTable";
import MainTag from "module/_core/app/component/Tag/MainTag";
import StatusTag from "module/_core/app/component/Tag/StatusTag";
import { ACTION_TAG_COLOR } from "module/auth/domain/constant/permission";
import { IPermission } from "module/auth/domain/model/permission";
import { CustomAuthService } from "module/auth/domain/service/custom";
import { RoleService } from "module/auth/domain/service/role";
import strings from "module/_core/infras/constant/strings";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { displaySuccessNoti } from "module/_core/infras/util/notification";
import { isActive } from "module/_core/infras/util/entityState";
import { Button, Checkbox, ConfigProvider, Form, Input, Switch } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { AuthService } from "module/auth/domain/service/auth";
import { AuthACP } from "module/auth/domain/config/accessControl/permission";
import { HeaderService } from "@module/_core/app/layout/MainHeader/service";
import { BreadcrumbService } from "@module/_core/app/layout/MainBreadcrumb/service";
import { AppLoadingView, AppLoadingViewOverlay } from "@module/_core/app/component/Loading/AppLoading";
import { EntityStateOptions } from "@module/_core/infras/constant/entityState";
import TagForm from "@module/_core/app/component/Tag/TagForm";
import { EntityState } from "@module/_core/infras/config/type/entityState";
import { useParams, useRouter } from "next/navigation";

interface UpdateRoleFormData {
    name: string;
    status: EntityState;
    permissions: {
        [key: string]: number[];
    };
}

const RoleDetailView = () => {
    const { setHeaderTitle } = HeaderService.useHeader(() => 0);
    const { setBreadcrumbItems } = BreadcrumbService.useBreadcrumb(() => 0);
    const router = useRouter();
    const { roleId } = useParams() || {};

    const { verifyACP } = AuthService.useAuth();
    const roleDetail = RoleService.useRoleDetail({
        roleId: parseInt(roleId as string),
        fetcherOptions: {
            staleTime: 0,
            gcTime: 0,
            enabled: !!roleId,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });
    useEffect(() => {
        if (roleDetail.data) {
            setHeaderTitle(`Chức vụ: ${roleDetail.data?.name}`, "/role");
            setBreadcrumbItems([{ title: "Chức vụ", href: "/role" }, { title: roleDetail.data?.name ?? "" }]);
        }
    }, [roleDetail]);

    const authExtraData = CustomAuthService.useAuthExtraData();

    const { updateRoleMutation } = RoleService.useRoleAction();

    const [updateRoleForm] = Form.useForm<UpdateRoleFormData>();

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isEditing || !roleDetail.data) return;

        const { name, status } = roleDetail.data;
        const permissionOptions: UpdateRoleFormData["permissions"] = {};

        (authExtraData.data?.permissions as IPermission[]).forEach(({ resource, actions }) => {
            permissionOptions[resource] = actions
                .filter(({ action }) =>
                    roleDetail.data?.permissions
                        ?.find((ele) => ele.resource === resource)
                        ?.actions.some((ele) => ele.action === action)
                )
                .map((ele) => ele.id);
        });

        updateRoleForm.setFieldsValue({
            name,
            status,
            permissions: permissionOptions
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    const handleSubmit = () => {
        // if (!data || !allPermissionData) return;

        updateRoleForm.validateFields().then(({ name, status, permissions }: UpdateRoleFormData) => {
            const updatedPermissions: number[] = [];

            for (const [key, value] of Object.entries(permissions)) {
                if (value.length !== 0) {
                    const actionIds = (authExtraData.data?.permissions as IPermission[])
                        ?.find((ele) => ele.resource === key)
                        ?.actions.filter(({ id }) => value.includes(id))
                        .map((ele) => ele.id);

                    if (actionIds !== undefined) {
                        updatedPermissions.push(...actionIds);
                    }
                }
            }

            updateRoleMutation.mutate(
                {
                    roleId: parseInt(roleId as string),
                    newRoleData: {
                        name,
                        status,
                        permissionIds: updatedPermissions
                    }
                },
                {
                    onSuccess: () => {
                        displaySuccessNoti({ description: "Chỉnh sửa chi tiết chức vụ thành công!" });
                        setIsEditing(false);
                    },
                    onError: (error) => {
                        errorHandler(error);
                    }
                }
            );
        });
    };

    const columns: ColumnsType<Pick<IPermission, "resource" | "actions">> = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            align: "center",
            render: (_, __, index) => index + 1
        },
        {
            title: "TÀI NGUYÊN",
            dataIndex: "resourceName"
        },
        {
            title: "HÀNH ĐỘNG",
            key: "actions",
            render: (_, { resource, actions }) =>
                !isEditing ? (
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
                ) : (
                    <div className="flex gap-1">
                        <Form.Item name={["permissions", resource]} className="mb-0">
                            <Checkbox.Group
                                options={actions.map(({ id, action, actionName, status }) => ({
                                    label: actionName ? `${actionName} (${action})` : (strings[action] ?? action),
                                    value: id,
                                    disabled: !isActive(status)
                                }))}
                            />
                        </Form.Item>
                    </div>
                )
        }
    ];

    return (
        <Block
            haederActions={
                <div className="flex gap-4">
                    {!isEditing ? (
                        verifyACP(AuthACP.UpdateRole) && (
                            <Button
                                type="primary"
                                className="py-1.5 px-6 text-base"
                                disabled={roleDetail.isPending || roleDetail.isFetching || roleDetail.isError}
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa chức vụ
                            </Button>
                        )
                    ) : (
                        <>
                            <Button
                                className="py-1.5 px-4 text-base flex items-center"
                                onClick={() => setIsEditing(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                className="py-1.5 px-6 text-base"
                                loading={updateRoleMutation.isPending}
                                disabled={authExtraData.isPending || authExtraData.isFetching || authExtraData.isError}
                                onClick={handleSubmit}
                            >
                                Lưu thay đổi
                            </Button>
                        </>
                    )}
                </div>
            }
        >
            {roleDetail.isPending ? (
                <AppLoadingView containerClassName="h-[60vh]" />
            ) : roleDetail.data ? (
                <MainForm name="updateRoleForm" form={updateRoleForm} className="relative">
                    {roleDetail.isFetching && <AppLoadingViewOverlay backDropClassName="!bg-[rgb(255,255,255,0.6)]" />}
                    <div className="form-grid-container gap-y-4 mb-6">
                        {!isEditing ? (
                            <>
                                <div className="flex gap-2 items-center">
                                    <span className="">Tên:</span>
                                    <span>{roleDetail.data?.name}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="">Trạng thái:</span>
                                    <StatusTag status={roleDetail.data?.status} />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="">Mã chức vụ:</span>
                                    <span>{roleDetail.data?.code}</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <span className="">Đăng ký mặc định:</span>
                                    <Checkbox checked={roleDetail.data?.defaultSignUp} />
                                </div>
                            </>
                        ) : (
                            <>
                                <Form.Item
                                    name="name"
                                    label="Tên chức vụ"
                                    rules={[{ required: true, message: strings.input_required_error }]}
                                >
                                    <Input placeholder="Tên chức vụ" />
                                </Form.Item>
                                <Form.Item
                                    name="status"
                                    label="Trạng thái"
                                    valuePropName="checked"
                                    initialValue={EntityState.ACTIVE}
                                >
                                    <Form.Item className="mb-0" shouldUpdate>
                                        {({ getFieldValue, setFieldValue }) =>
                                            EntityStateOptions.map(({ value, label }) => (
                                                <TagForm
                                                    key={value}
                                                    isActive={getFieldValue("status") === value}
                                                    onChange={() => setFieldValue("status", value)}
                                                    title={label}
                                                />
                                            ))
                                        }
                                    </Form.Item>
                                </Form.Item>
                            </>
                        )}
                    </div>
                    <ConfigProvider renderEmpty={authExtraData.isError ? ErrorEmpty : undefined}>
                        <div className="flex justify-between items-center mb-5 mt-4">
                            <div>Danh sách Permission</div>
                        </div>
                        <MainTable
                            dataSource={!isEditing ? roleDetail.data.permissions : authExtraData.data?.permissions}
                            // dataSource={data.permissions}
                            scroll={{ x: "max-content" }}
                            columns={columns}
                            pagination={false}
                            rowKey="id"
                            loading={!isEditing ? false : authExtraData.isPending || authExtraData.isFetching}
                        />
                    </ConfigProvider>
                </MainForm>
            ) : null}
            {roleDetail.isError ? <ErrorEmpty /> : null}
        </Block>
    );
};

export default RoleDetailView;
