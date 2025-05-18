import MainForm from "module/_core/app/component/Form/MainForm";
import { DEFAULT_ACTION_LIST } from "module/auth/domain/constant/permission";
import { CreatePermisisionDTO, UpdatePermisisionDTO } from "module/auth/domain/dto/permission";
import { IPermission, IPermissionAction } from "module/auth/domain/model/permission";
import { PermissionService } from "module/auth/domain/service/permission";
import { sortActions } from "module/auth/domain/utils/permission";
import { EntityState } from "module/_core/infras/config/type/entityState";
import strings from "module/_core/infras/constant/strings";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { displaySuccessNoti } from "module/_core/infras/util/notification";
import { getStatus, isActive } from "module/_core/infras/util/entityState";
import { Optional } from "lib/types/generics";
import { Button, Checkbox, Form, Input, Modal, message } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";

interface PermissionFormHandler {
    openCreateForm: () => void;
    openUpdateForm: (permissionData: IPermission) => void;
}

interface FormModalStateClose {
    isModalOpen: false;
    formType: null;
    permissionData: null;
}

interface FormModalStateCreate {
    isModalOpen: true;
    formType: "create";
    permissionData: null;
}

interface FormModalStateUpdate {
    isModalOpen: true;
    formType: "update";
    permissionData: IPermission;
}

export type FormModalState = FormModalStateClose | FormModalStateCreate | FormModalStateUpdate;

interface PermissionFormData {
    resource: string;
    resourceName: string;
    actions: string[];
    addAction: {
        action: string;
        actionName: string;
    };
}

const PermissionForm = forwardRef<PermissionFormHandler>((_, ref) => {
    const { createPermissionMutation, updatePermissionMutation } = PermissionService.usePermissionAction();

    const [permissionForm] = Form.useForm<PermissionFormData>();

    const actionValue = Form.useWatch(["addAction", "action"], permissionForm);
    const actionNameValue = Form.useWatch(["addAction", "actionName"], permissionForm);

    const [formModalState, setFormModalState] = useState<FormModalState>({
        isModalOpen: false,
        formType: null,
        permissionData: null
    });

    const [createActionList, setCreateActionList] = useState<Omit<IPermissionAction, "id" | "status">[]>([]);
    const [updateActionList, setUpdateActionList] = useState<Optional<Omit<IPermissionAction, "status">, "id">[]>([]);

    const [modalTitle, setModalTitle] = useState<string>("");

    useImperativeHandle(ref, () => ({
        openCreateForm: () => {
            setFormModalState({
                isModalOpen: true,
                formType: "create",
                permissionData: null
            });

            setModalTitle("Thêm tài nguyên");

            setCreateActionList(
                DEFAULT_ACTION_LIST.map((ele) => ({
                    action: ele
                }))
            );

            permissionForm.resetFields();
        },
        openUpdateForm: (permissionData) => {
            setFormModalState({
                isModalOpen: true,
                formType: "update",
                permissionData
            });

            setModalTitle("Chỉnh sửa tài nguyên");

            const actions = permissionData.actions.map(({ id, action, actionName }) => ({
                id,
                action,
                actionName
            }));
            const defaultActions = DEFAULT_ACTION_LIST.filter(
                (ele) => !actions.some(({ action }) => ele === action)
            ).map((ele) => ({
                action: ele
            }));

            setUpdateActionList(sortActions([...defaultActions, ...actions]));

            permissionForm.setFieldsValue({
                resource: permissionData.resource,
                resourceName: permissionData.resourceName,
                actions: permissionData.actions.filter(({ status }) => isActive(status)).map(({ action }) => action),
                addAction: {
                    action: "",
                    actionName: ""
                }
            });
        }
    }));

    const addAction = () => {
        const rules = [
            {
                error: !actionValue?.trim(),
                msg: "Hãy điền hành động"
            },
            {
                error: !actionNameValue?.trim(),
                msg: "Hãy điền tên hành động"
            },
            {
                error: (formModalState.formType === "create" ? createActionList : updateActionList).some(
                    (ele) => ele.action === actionValue?.trim()
                ),
                msg: "Hành động đã tồn tại"
            }
        ];

        for (let i = 0; i < rules.length; i++) {
            const { error, msg } = rules[i];
            if (error) {
                message.error(msg);
                return;
            }
        }

        if (formModalState.formType === "create") {
            setCreateActionList((prev) => [
                ...prev,
                {
                    action: actionValue.trim(),
                    actionName: actionNameValue.trim()
                }
            ]);
        } else {
            setUpdateActionList((prev) => [
                ...prev,
                {
                    action: actionValue.trim(),
                    actionName: actionNameValue.trim()
                }
            ]);
        }

        permissionForm.setFieldValue(["addAction", "action"], "");
        permissionForm.setFieldValue(["addAction", "actionName"], "");
    };

    const onOk = () => {
        permissionForm.validateFields().then((values: PermissionFormData) => {
            const { resource, resourceName, actions } = values;

            if (formModalState.formType === "create") {
                const newActions: CreatePermisisionDTO["actions"] = createActionList
                    .filter(({ action }) => actions.includes(action))
                    .map((ele) => ({ ...ele, status: EntityState.ACTIVE }));

                createPermissionMutation.mutate(
                    {
                        resource,
                        resourceName,
                        actions: newActions,
                        status: EntityState.ACTIVE
                    },
                    {
                        onSuccess: () => {
                            displaySuccessNoti({ description: "Thêm tài nguyên thành công!" });
                            closeModal();
                        },
                        onError: (error) => {
                            errorHandler(error);
                        }
                    }
                );
            } else if (formModalState.formType === "update") {
                const newActions: UpdatePermisisionDTO["actions"] = updateActionList
                    .filter(
                        (ele) =>
                            actions.includes(ele.action) ||
                            formModalState.permissionData.actions.some(({ action }) => ele.action === action)
                    )
                    .map((ele) => ({
                        ...ele,
                        status: getStatus(actions.includes(ele.action))
                    }));

                updatePermissionMutation.mutate(
                    {
                        permissionId: formModalState.permissionData.id,
                        newPermissionData: {
                            resourceName,
                            actions: newActions,
                            status: EntityState.ACTIVE
                        }
                    },
                    {
                        onSuccess: () => {
                            displaySuccessNoti({ description: "Chỉnh sửa tài nguyên thành công!" });
                            closeModal();
                        },
                        onError: (error) => {
                            errorHandler(error);
                        }
                    }
                );
            }
        });
    };

    const closeModal = () => {
        setFormModalState({
            isModalOpen: false,
            formType: null,
            permissionData: null
        });
    };

    return (
        <Modal
            centered
            open={formModalState.isModalOpen}
            title={modalTitle}
            okText={strings.save}
            confirmLoading={createPermissionMutation.isPending || updatePermissionMutation.isPending}
            cancelText={strings.cancel}
            onCancel={closeModal}
            onOk={onOk}
            style={{ maxHeight: "70vh" }}
        >
            <MainForm form={permissionForm} name="permissionForm">
                <Form.Item
                    name="resourceName"
                    label="Tên tài nguyên"
                    rules={[{ required: true, message: strings.input_required_error }]}
                >
                    <Input placeholder="Ví dụ: Người dùng" />
                </Form.Item>
                {formModalState.formType === "create" ? (
                    <Form.Item
                        name="resource"
                        label="Tài nguyên"
                        rules={[{ required: true, message: strings.input_required_error }]}
                    >
                        <Input placeholder="Ví dụ: user" />
                    </Form.Item>
                ) : null}
                <Form.Item
                    name="actions"
                    label="Hành động"
                    rules={[{ required: true, message: strings.input_required_error }]}
                >
                    <Checkbox.Group
                        options={(formModalState.formType === "create" ? createActionList : updateActionList).map(
                            (ele) => ({
                                label: ele.actionName
                                    ? `${ele.actionName} (${ele.action})`
                                    : (strings[ele.action] ?? ele.action),
                                value: ele.action
                            })
                        )}
                    />
                </Form.Item>
                <Form.Item label="Thêm hành động">
                    <div className="tab:flex gap-2">
                        <Form.Item name={["addAction", "action"]} className="w-full">
                            <Input placeholder="Hành động (Ví dụ: filter)" />
                        </Form.Item>
                        <Form.Item name={["addAction", "actionName"]} className="w-full">
                            <Input placeholder="Tên hành động (Ví dụ: Lọc)" />
                        </Form.Item>
                        <Button type="primary" onClick={addAction}>
                            {strings.add}
                        </Button>
                    </div>
                </Form.Item>
            </MainForm>
        </Modal>
    );
});

export default PermissionForm;
