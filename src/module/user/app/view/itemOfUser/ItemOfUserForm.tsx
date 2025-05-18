import MainForm from "module/_core/app/component/Form/MainForm";
import strings from "module/_core/infras/constant/strings";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { displaySuccessNoti } from "module/_core/infras/util/notification";
import { DatePicker, Form, Modal, Select } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ItemDTO } from "@module/item/domain/dto/item";
import { UserItemDTO } from "@module/item/domain/dto/userItem";
import { StatusUserItemOption, StatusUserItemTypeEnum } from "@module/item/domain/config/type/StatusUserItemType";
import dayjs from "dayjs";
import TagForm from "@module/_core/app/component/Tag/TagForm";
import { UserItemService } from "@module/item/domain/service/userItem";
import { cleanObject } from "@lib/util/functions";

interface ItemOfUserFormHandler {
    openCreateForm: () => void;
    openUpdateForm: (userItemData: UserItemDTO) => void;
}

interface FormModalStateClose {
    isModalOpen: false;
    formType: null;
    userItemData: null;
}

interface FormModalStateCreate {
    isModalOpen: true;
    formType: "create";
    userItemData: null;
}

interface FormModalStateUpdate {
    isModalOpen: true;
    formType: "update";
    userItemData: UserItemDTO;
}

export type FormModalState = FormModalStateClose | FormModalStateCreate | FormModalStateUpdate;

interface ItemOfUserFormData {
    itemId: number;
    activatedAt?: Date;
    expiredAt?: Date;
    status: StatusUserItemTypeEnum;
}

interface ItemOfUserFormProps {
    userId?: number;
    items?: ItemDTO[];
}

const ItemOfUserForm = forwardRef<ItemOfUserFormHandler, ItemOfUserFormProps>(({ items, userId }, ref) => {
    const [modalTitle, setModalTitle] = useState<string>("");
    const [formModalState, setFormModalState] = useState<FormModalState>({
        isModalOpen: false,
        formType: null,
        userItemData: null
    });

    const [itemForm] = Form.useForm<ItemOfUserFormData>();

    const { createUserItemMutation, updateOneUserItemMutation } = UserItemService.useUserItemAction();

    useImperativeHandle(ref, () => ({
        openCreateForm: () => {
            setFormModalState({
                isModalOpen: true,
                formType: "create",
                userItemData: null
            });

            setModalTitle("Thêm vật phẩm");

            itemForm.resetFields();
        },
        openUpdateForm: (userItemData) => {
            setFormModalState({
                isModalOpen: true,
                formType: "update",
                userItemData
            });

            setModalTitle("Chỉnh sửa vật phẩm");

            const { expiredAt, activatedAt, itemId, status, user } = userItemData;

            itemForm.setFieldsValue(
                cleanObject({
                    expiredAt: expiredAt ? dayjs(expiredAt) : undefined,
                    activatedAt: activatedAt ? dayjs(activatedAt) : undefined,
                    itemId,
                    status
                })
            );
        }
    }));

    const onOk = () => {
        if (!userId) return;

        itemForm.validateFields().then(async (values: ItemOfUserFormData) => {
            if (formModalState.formType === "create") {
                createUserItemMutation.mutate(
                    {
                        createUserItemDTO: {
                            ...values,
                            userId,
                            expiredAt: values.expiredAt?.toISOString(),
                            activatedAt: values.activatedAt?.toISOString()
                        }
                    },
                    {
                        onSuccess: () => {
                            displaySuccessNoti({ description: "Thêm vật phẩm thành công!" });
                            closeModal();
                        },
                        onError: (error) => {
                            errorHandler(error);
                        }
                    }
                );
            } else if (formModalState.formType === "update") {
                updateOneUserItemMutation.mutate(
                    {
                        userItemId: formModalState.userItemData.id,
                        updateOneUserItemDTO: {
                            ...values,
                            userId,
                            expiredAt: values.expiredAt?.toISOString(),
                            activatedAt: values.activatedAt?.toISOString()
                        }
                    },
                    {
                        onSuccess: () => {
                            displaySuccessNoti({ description: "Cập nhật vật phẩm thành công!" });
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
            userItemData: null
        });
    };

    return (
        <Modal
            centered
            open={formModalState.isModalOpen}
            title={modalTitle}
            okText={strings.save}
            confirmLoading={
                formModalState.formType === "create"
                    ? createUserItemMutation.isPending
                    : updateOneUserItemMutation.isPending
            }
            cancelText={strings.cancel}
            onOk={onOk}
            onCancel={closeModal}
            width={800}
            styles={{ content: { padding: 0 }, header: { padding: "20px 24px" }, footer: { padding: "20px 24px" } }}
        >
            <MainForm
                className="max-h-[60vh] overflow-y-scroll px-5 scrollbar-y-light -mt-3"
                form={itemForm}
                name="itemForm"
            >
                <Form.Item
                    name="itemId"
                    label="Vật phẩm"
                    rules={[{ required: true, message: strings.input_required_error }]}
                >
                    <Select
                        placeholder="Vật phẩm"
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={items?.map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái" initialValue={StatusUserItemTypeEnum.ACTIVE}>
                    <Form.Item className="mb-0" shouldUpdate>
                        {({ getFieldValue, setFieldValue }) =>
                            StatusUserItemOption.map(({ value, label }) => (
                                <TagForm
                                    className="mb-3"
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
                    name="activatedAt"
                    label="Ngày nhận"
                    initialValue={dayjs(Date.now())}
                    rules={[{ required: true, message: strings.input_required_error }]}
                >
                    <DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item
                    name="expiredAt"
                    label="Ngày hết hạn"
                    initialValue={dayjs(Date.now())}
                    rules={[{ required: true, message: strings.input_required_error }]}
                >
                    <DatePicker className="w-full" showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
            </MainForm>
        </Modal>
    );
});

export default ItemOfUserForm;
