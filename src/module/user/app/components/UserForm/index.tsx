import MainForm from "module/_core/app/component/Form/MainForm";
import MainImgCrop from "module/_core/app/component/Upload/MainImgCrop";
import strings from "module/_core/infras/constant/strings";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { onPreview, handleImage } from "module/_core/infras/util/image";
import { Form, Input, InputNumber, Select, Switch, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { IUser } from "@module/user/domain/model/user";
import { UserService } from "@module/user/domain/service/user";
import { Gender } from "@module/user/domain/config/type/gender";
import { CustomAuthService } from "@module/auth/domain/service/custom";
import { CustomCommonService } from "@module/common/domain/service/custom";
import { EntityState } from "@module/_core/infras/config/type/entityState";
import TagForm from "@module/_core/app/component/Tag/TagForm";
import { EntityStateOptions } from "@module/_core/infras/constant/entityState";

interface handleSubmitFormProps {
    submitSuccess?: () => void;
    submitError?: () => void;
    isSubmitting?: (status: boolean) => void;
}

interface UserFormHandler {
    handleSubmit: (submitFunctions: handleSubmitFormProps) => void;
    handleClose: () => void;
}

export interface UserFormData {
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    gender: Gender;
    yearOfBirth: number;
    linkFacebook: string;
    cityId: number;
    schoolId: number;
    roleIds: number[];
    status: EntityState;
}

interface UserFormProps {
    userData?: IUser;
}

const UserForm = forwardRef<UserFormHandler, UserFormProps>(({ userData }, ref) => {
    const { createUserMutation, updateOneUserMutation } = UserService.useUserAction();

    const [userForm] = Form.useForm<UserFormData>();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [passwordEnabled, setPasswordEnabled] = useState(false);
    const [cityId, setCityId] = useState<number>();

    const authExtraData = CustomAuthService.useAuthExtraData();
    const cityExtraData = CustomCommonService.useCityExtraData();
    const schoolExtraData = CustomCommonService.useSchoolExtraData(cityId);

    useEffect(() => {
        if (userData) {
            setFileList([
                {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    url: userData.avatar
                }
            ]);

            const { name, username, email, phone, gender, yearOfBirth, linkFacebook, city, school, roles, status } =
                userData;
            userForm.setFieldsValue({
                name,
                username,
                password: undefined,
                email,
                phone,
                gender,
                status,
                yearOfBirth,
                linkFacebook,
                cityId: city?.id,
                schoolId: school?.id,
                roleIds: authExtraData.data?.roles
                    ?.filter(({ code }) => roles.some((ele) => ele.code === code))
                    .map(({ id }) => id)
            });
            setCityId(city?.id);
        }
    }, [userData]);

    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit,
        handleClose: () => {
            userForm.resetFields();
            setFileList([]);
            setCityId(undefined);
        }
    }));

    const handleSubmit = ({ submitError, submitSuccess, isSubmitting }: handleSubmitFormProps) => {
        userForm.validateFields().then(async (values: UserFormData) => {
            const avatarImage = fileList[0]?.originFileObj
                ? await handleImage(
                      fileList[0]?.originFileObj as File,
                      UserService.USER_AVATAR_HEIGHT,
                      UserService.USER_AVATAR_HEIGHT * UserService.USER_AVATAR_ASPECT,
                      true
                  )
                : undefined;
            if (isSubmitting) isSubmitting(true);
            if (!userData) {
                createUserMutation.mutate(
                    {
                        createUserDTO: {
                            ...values,
                            avatarHash: avatarImage?.blurhash
                        },
                        avatarImage: avatarImage?.file
                    },
                    {
                        onSuccess: () => {
                            if (submitSuccess) submitSuccess();
                            if (isSubmitting) isSubmitting(false);
                        },
                        onError: (error) => {
                            errorHandler(error);
                            if (submitError) submitError();
                            if (isSubmitting) isSubmitting(false);
                        }
                    }
                );
            } else {
                updateOneUserMutation.mutate(
                    {
                        userId: userData.id,
                        updateOneUserDTO: {
                            ...values,
                            avatarHash: avatarImage?.blurhash
                        },
                        avatarImage: avatarImage?.file
                    },
                    {
                        onSuccess: () => {
                            if (submitSuccess) submitSuccess();
                            if (isSubmitting) isSubmitting(false);
                        },
                        onError: (error) => {
                            errorHandler(error);
                            if (submitError) submitError();
                            if (isSubmitting) isSubmitting(false);
                        }
                    }
                );
            }
        });
    };

    return (
        <MainForm
            form={userForm}
            name="userForm"
            onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
            }}
            onFinish={handleSubmit}
        >
            <div className="flex flex-col justify-between tab:flex-row mb-4">
                <div className="tab:w-[48%]">
                    <Form.Item
                        name="name"
                        label="Họ và tên"
                        rules={[{ required: true, message: strings.input_required_error }]}
                    >
                        <Input placeholder="Họ và tên" />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Tài khoản"
                        rules={[{ required: true, message: strings.input_required_error }]}
                    >
                        <Input placeholder="Tài khoản" />
                    </Form.Item>
                    {!userData ? (
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: strings.input_required_error }]}
                        >
                            <Input placeholder="Mật khẩu" />
                        </Form.Item>
                    ) : null}
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: strings.input_required_error }]}
                    >
                        <Input placeholder="Email" disabled={!!userData} />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: strings.input_required_error }]}
                    >
                        <Input placeholder="Số điện thoại" disabled={!!userData} />
                    </Form.Item>
                    <Form.Item name="linkFacebook" label="Link Facebook">
                        <Input placeholder="Link Facebook" />
                    </Form.Item>
                    <Form.Item className="hidden tab:inline" label="Avatar">
                        <MainImgCrop aspect={UserService.USER_AVATAR_ASPECT}>
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
                </div>
                <div className="tab:w-[48%]">
                    <Form.Item name="gender" label="Giới tính">
                        <Form.Item className="mb-0" shouldUpdate>
                            {({ getFieldValue, setFieldValue }) =>
                                Object.entries(UserService.genderMapName).map(([key, value]) => (
                                    <TagForm
                                        key={key}
                                        isActive={getFieldValue("gender") === key}
                                        onChange={() => setFieldValue("gender", key)}
                                        title={value}
                                    />
                                ))
                            }
                        </Form.Item>
                    </Form.Item>
                    <Form.Item name="yearOfBirth" label="Năm sinh">
                        <InputNumber className="w-full" placeholder="Năm sinh" controls={false} />
                    </Form.Item>
                    <Form.Item name="cityId" label="Tỉnh thành">
                        <Select
                            placeholder="Tỉnh thành"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                            options={
                                cityExtraData.data?.cities
                                    ? cityExtraData.data?.cities.map(({ id, name }) => ({ value: id, label: name }))
                                    : []
                            }
                            onChange={(value) => setCityId(value)}
                        />
                    </Form.Item>
                    <Form.Item name="schoolId" label="Trường học">
                        <Select
                            placeholder="Trường học"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                            options={
                                schoolExtraData.data?.schools
                                    ? schoolExtraData.data?.schools.map(({ id, name }) => ({
                                          value: id,
                                          label: name
                                      }))
                                    : []
                            }
                        />
                    </Form.Item>
                    <Form.Item name="roleIds" label="Chức vụ">
                        <Select
                            placeholder="Chức vụ"
                            mode="multiple"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                            options={
                                authExtraData.data?.roles
                                    ? authExtraData.data?.roles.map(({ id, name }) => ({ value: id, label: name }))
                                    : []
                            }
                        />
                    </Form.Item>
                    <Form.Item className="tab:hidden" label="Avatar">
                        <MainImgCrop aspect={UserService.USER_AVATAR_ASPECT}>
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
                </div>
            </div>
            {!!userData ? (
                <div className="tab:w-[48%]">
                    <div className="flex items-center gap-2">
                        <h4 className="text-lg font-medium mb-2">Thay đổi mật khẩu</h4>
                        <Switch
                            checked={passwordEnabled}
                            onChange={(checked) => {
                                setPasswordEnabled(checked);
                                if (!checked) userForm.setFieldValue("password", undefined);
                            }}
                        />
                    </div>
                    <Form.Item name="password" label="Mật khẩu mới">
                        <Input placeholder="Mật khẩu mới" disabled={!passwordEnabled} />
                    </Form.Item>
                </div>
            ) : null}
        </MainForm>
    );
});

export default UserForm;
