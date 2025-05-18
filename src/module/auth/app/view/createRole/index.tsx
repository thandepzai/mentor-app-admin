"use client";

import Block from "module/_core/app/component/Block";
import SaveButton from "module/_core/app/component/Button/SaveButton";
import ErrorEmpty from "module/_core/app/component/Empty/ErrorEmpty";
import MainForm from "module/_core/app/component/Form/MainForm";
import MainTable from "module/_core/app/component/Table/MainTable";
import { IPermission } from "module/auth/domain/model/permission";
import { CustomAuthService } from "module/auth/domain/service/custom";
import { RoleService } from "module/auth/domain/service/role";
import strings from "module/_core/infras/constant/strings";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { Button, Checkbox, ConfigProvider, Form, Input, Modal, Result } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HeaderService } from "@module/_core/app/layout/MainHeader/service";
import { BreadcrumbService } from "@module/_core/app/layout/MainBreadcrumb/service";
import { EntityStateOptions } from "@module/_core/infras/constant/entityState";
import TagForm from "@module/_core/app/component/Tag/TagForm";
import { EntityState } from "@module/_core/infras/config/type/entityState";
import { useRouter } from "next/navigation";
import { isOnServer } from "@module/_core/infras/util/isOnServer";

interface CreateRoleFormData {
    name: string;
    code: string;
    status: EntityState;
    permissions: {
        [key: string]: number[];
    };
}

const CreateRoleView = () => {
    const router = useRouter();
    const { setHeaderTitle } = HeaderService.useHeader(() => 0);
    const { setBreadcrumbItems } = BreadcrumbService.useBreadcrumb(() => 0);
    useEffect(() => {
        setHeaderTitle("Tạo chức vụ mới", "/role");
        setBreadcrumbItems([{ title: "Chức vụ", href: "/role" }, { title: "Tạo chức vụ mới" }]);
    }, []);
    const authExtraData = CustomAuthService.useAuthExtraData();

    const { createRoleMutation } = RoleService.useRoleAction();

    const [createRoleForm] = Form.useForm<CreateRoleFormData>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: ColumnsType<IPermission> = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            align: "center",
            render: (_, { id }) => (
                <span>
                    {authExtraData.data?.permissions &&
                        authExtraData.data?.permissions.findIndex((ele) => id === ele.id) + 1}
                </span>
            )
        },
        {
            title: "Tên tài nguyên",
            dataIndex: "resourceName"
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, { resource, actions }) => (
                <div className="flex gap-1">
                    <Form.Item name={["permissions", resource]} className="mb-0">
                        <Checkbox.Group
                            options={actions.map(({ id, action, actionName }) => ({
                                label: actionName ? `${actionName} (${action})` : (strings[action] ?? action),
                                value: id
                            }))}
                        />
                    </Form.Item>
                </div>
            )
        }
    ];

    const handleSubmit = ({ name, code, status, permissions }: CreateRoleFormData) => {
        createRoleMutation.mutate(
            {
                name,
                code,
                status,
                permissionIds: Object.entries(permissions)
                    .map((ele) => ele[1])
                    .flat()
                    .filter((ele) => !!ele)
            },
            {
                onSuccess: () => {
                    setIsModalOpen(true);
                    // console.log(createRoleMutation);
                },
                onError: (error) => {
                    errorHandler(error);
                }
            }
        );
    };

    return (
        <Block>
            <MainForm name="createRoleForm" form={createRoleForm} onFinish={handleSubmit}>
                <div className="form-grid-container my-6">
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
                    <Form.Item
                        name="code"
                        label="Mã chức vụ"
                        rules={[{ required: true, message: strings.input_required_error }]}
                    >
                        <Input placeholder="Mã chức vụ" />
                    </Form.Item>
                </div>
                <ConfigProvider renderEmpty={authExtraData.isError ? ErrorEmpty : undefined}>
                    <div className="flex justify-between items-center mb-5 px-1">
                        <div>Danh sách quyền</div>
                    </div>
                    <MainTable
                        dataSource={authExtraData.data?.permissions}
                        columns={columns}
                        pagination={false}
                        rowKey="id"
                        loading={authExtraData.isPending || authExtraData.isFetching}
                    />
                </ConfigProvider>
                <div className="mt-6 w-full flex justify-end">
                    <SaveButton
                        text="Tạo chức vụ"
                        loading={createRoleMutation.isPending}
                        disabled={authExtraData.isPending || authExtraData.isFetching || authExtraData.isError}
                    />
                </div>
            </MainForm>
            <Modal open={isModalOpen} footer={null} closable={false}>
                <Result
                    status="success"
                    className="py-8 px-0"
                    title="Tạo chức vụ mới thành công!"
                    extra={[
                        <Link key="back" href="/role">
                            <Button>Về trang danh sách chức vụ</Button>
                        </Link>,
                        <Button
                            type="primary"
                            key="another"
                            onClick={() => {
                                if (!isOnServer) {
                                    window.location.reload();
                                }
                            }}
                        >
                            Tạo chức vụ khác
                        </Button>
                    ]}
                />
            </Modal>
        </Block>
    );
};

export default CreateRoleView;
