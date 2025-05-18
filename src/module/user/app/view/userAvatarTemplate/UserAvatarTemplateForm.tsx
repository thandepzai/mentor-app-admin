import MainForm from "module/_core/app/component/Form/MainForm";
import MainImgCrop from "module/_core/app/component/Upload/MainImgCrop";
import strings from "module/_core/infras/constant/strings";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { handleImage, onPreview } from "module/_core/infras/util/image";
import { displayErrorNoti, displaySuccessNoti } from "module/_core/infras/util/notification";
import { Form, Input, Modal, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { EntityState } from "@module/_core/infras/config/type/entityState";
import { EntityStateOptions } from "@module/_core/infras/constant/entityState";
import TagForm from "@module/_core/app/component/Tag/TagForm";
import { UserAvatarTemplateService } from "@module/user/domain/service/userAvatarTemplate";
import { UserAvatarTemplateDTO, CreateUserAvatarTemplateDTO } from "@module/user/domain/dto/userAvatarTemplate";

interface UserAvatarTemplateFormHandler {
    openCreateForm: () => void;
    openUpdateForm: (userAvatarTemplateData: UserAvatarTemplateDTO) => void;
}

interface FormModalStateClose {
    isModalOpen: false;
    formType: null;
    userAvatarTemplateData: null;
}

interface FormModalStateCreate {
    isModalOpen: true;
    formType: "create";
    userAvatarTemplateData: null;
}

interface FormModalStateUpdate {
    isModalOpen: true;
    formType: "update";
    userAvatarTemplateData: UserAvatarTemplateDTO;
}

export type FormModalState = FormModalStateClose | FormModalStateCreate | FormModalStateUpdate;

interface UserAvatarTemplateFormData extends CreateUserAvatarTemplateDTO {}

const UserAvatarTemplateForm = forwardRef<UserAvatarTemplateFormHandler>((_, ref) => {
    const { createUserAvatarTemplateMutation, updateUserAvatarTemplateMutation } =
        UserAvatarTemplateService.useUserAvatarTemplateAction();

    const [userAvatarTemplateForm] = Form.useForm<UserAvatarTemplateFormData>();

    const [formModalState, setFormModalState] = useState<FormModalState>({
        isModalOpen: false,
        formType: null,
        userAvatarTemplateData: null
    });
    const [modalTitle, setModalTitle] = useState<string>("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (fileList[0]?.name) {
            const fileName = fileList[0].name.split(".").slice(0, -1).join(".");
            userAvatarTemplateForm.setFieldValue("name", fileName);
        }
    }, [fileList]);

    useImperativeHandle(ref, () => ({
        openCreateForm: () => {
            setFormModalState({
                isModalOpen: true,
                formType: "create",
                userAvatarTemplateData: null
            });

            setModalTitle("Thêm Avatar");

            setFileList([]);
            userAvatarTemplateForm.resetFields();
        },
        openUpdateForm: (userAvatarTemplateData) => {
            setFormModalState({
                isModalOpen: true,
                formType: "update",
                userAvatarTemplateData
            });

            setModalTitle("Chỉnh sửa Avatar");

            setFileList([
                {
                    uid: "-1",
                    name: `${userAvatarTemplateData.name}.png`,
                    status: "done",
                    url: userAvatarTemplateData.url
                }
            ]);

            userAvatarTemplateForm.setFieldsValue({ ...userAvatarTemplateData });
        }
    }));

    const onOk = () => {
        userAvatarTemplateForm.validateFields().then(async (values: UserAvatarTemplateFormData) => {
            const thumb = fileList[0]?.originFileObj
                ? await handleImage(
                      fileList[0]?.originFileObj as File,
                      UserAvatarTemplateService.USER_AVATAR_TEMPLATE_HEIGHT,
                      UserAvatarTemplateService.USER_AVATAR_TEMPLATE_HEIGHT *
                          UserAvatarTemplateService.USER_AVATAR_TEMPLATE_ASPECT
                  )
                : undefined;

            if (formModalState.formType === "create") {
                if (!thumb) {
                    displayErrorNoti({ description: "Vui lòng thêm ảnh." });
                    return;
                }

                createUserAvatarTemplateMutation.mutate(
                    {
                        createUserAvatarTemplateDTO: values,
                        template: thumb?.file
                    },
                    {
                        onSuccess: () => {
                            displaySuccessNoti({ description: "Thêm Avatar thành công!" });
                            closeModal();
                        },
                        onError: (error) => {
                            errorHandler(error);
                        }
                    }
                );
            } else if (formModalState.formType === "update") {
                updateUserAvatarTemplateMutation.mutate(
                    {
                        avatarId: formModalState.userAvatarTemplateData.id,
                        updateUserAvatarTemplateDTO: values,
                        template: thumb?.file
                    },
                    {
                        onSuccess: () => {
                            displaySuccessNoti({ description: "Cập nhật Avatar thành công!" });
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
            userAvatarTemplateData: null
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
                    ? createUserAvatarTemplateMutation.isPending
                    : updateUserAvatarTemplateMutation.isPending
            }
            cancelText={strings.cancel}
            onOk={onOk}
            onCancel={closeModal}
        >
            <MainForm form={userAvatarTemplateForm} name="userAvatarTemplateForm">
                <Form.Item
                    label={
                        <div className="flex gap-1">
                            <span className="text-red-400">*</span>Ảnh
                        </div>
                    }
                >
                    <MainImgCrop aspect={UserAvatarTemplateService.USER_AVATAR_TEMPLATE_ASPECT}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList: newFileList }) => {
                                setFileList(newFileList.slice(-1));
                            }}
                            onPreview={onPreview}
                        >
                            + Tải ảnh lên
                        </Upload>
                    </MainImgCrop>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Tên ảnh"
                    rules={[{ required: true, message: strings.input_required_error }]}
                >
                    <Input placeholder="Tên ảnh" />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái" valuePropName="checked" initialValue={EntityState.ACTIVE}>
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
            </MainForm>
        </Modal>
    );
});

export default UserAvatarTemplateForm;
