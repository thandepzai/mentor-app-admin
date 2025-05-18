"use client";

import { CloseOutlined, FacebookOutlined } from "@ant-design/icons";
import Block from "module/_core/app/component/Block";
import FilterForm from "module/_core/app/component/FilterForm";
import { FilterFormItemType } from "module/_core/app/component/FilterForm/type";
import MainTable from "module/_core/app/component/Table/MainTable";
import QueryPageSizeSelect from "module/_core/app/component/Table/QueryPageSizeSelect";
import QueryPagination from "module/_core/app/component/Table/QueryPagination";
import { getSortQuery, handleSort } from "module/_core/app/component/Table/utils";
import StatusTag from "module/_core/app/component/Tag/StatusTag";
import { AuthACP } from "module/auth/domain/config/accessControl/permission";
import { AuthService } from "module/auth/domain/service/auth";
import { CustomAuthService } from "module/auth/domain/service/custom";
import { CustomCommonService } from "module/common/domain/service/custom";
import { UserFilterDTO } from "module/user/domain/dto/user";
import { IUser } from "module/user/domain/model/user";
import { UserService } from "module/user/domain/service/user";
import strings from "module/_core/infras/constant/strings";
import useFilter from "module/_core/infras/hook/useFilter";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { displaySuccessNoti } from "module/_core/infras/util/notification";
import { getRange } from "module/_core/infras/util/pagination";
import { Button, Divider, Modal, Popconfirm, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { ElementRef, useEffect, useRef, useState } from "react";
import { HeaderService } from "@module/_core/app/layout/MainHeader/service";
import { BreadcrumbService } from "@module/_core/app/layout/MainBreadcrumb/service";
import Link from "next/link";
import { AppLoadingView } from "@module/_core/app/component/Loading/AppLoading";
import ErrorEmpty from "@module/_core/app/component/Empty/ErrorEmpty";
import { keepPreviousData } from "@tanstack/react-query";
import EmptyThumb from "@module/_core/app/component/EmptyThumb";
import UserForm from "../../components/UserForm";
import { EntityStateOptions } from "@module/_core/infras/constant/entityState";
import { useWindowSize } from "@lib/hook/useWindowSize";

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const UserView = () => {
    const { setHeaderTitle } = HeaderService.useHeader(() => 0);
    const { setDefault } = BreadcrumbService.useBreadcrumb(() => 0);
    useEffect(() => {
        setHeaderTitle("Người dùng");
        setDefault();
    }, []);
    const { deviceType } = useWindowSize();
    const { verifyACP } = AuthService.useAuth();
    const { filter: userFilter, changeFilter: changeUserFilter } = useFilter<UserFilterDTO>();
    const {
        name,
        username,
        email,
        phone,
        yob,
        cityId,
        roleId,
        status,
        sort,
        page = 1,
        pageSize = DEFAULT_PAGE_SIZE
    } = userFilter;

    const { data, isPending, isFetching, isError } = UserService.useUser({
        filter: {
            name,
            username,
            email,
            phone,
            yob,
            cityId,
            roleId,
            status,
            sort,
            page: page ?? 1,
            pageSize: pageSize ?? DEFAULT_PAGE_SIZE
        },
        fetcherOptions: {
            staleTime: 0,
            gcTime: 0,
            placeholderData: keepPreviousData,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });

    const authExtraData = CustomAuthService.useAuthExtraData();
    const cityExtraData = CustomCommonService.useCityExtraData();

    const { deleteOneUserMutation } = UserService.useUserAction();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userFormRef = useRef<ElementRef<typeof UserForm>>(null);

    const handleCreateUser = () => {
        userFormRef.current?.handleSubmit({
            isSubmitting: (status) => setIsSubmitting(status),
            submitSuccess: () => {
                setIsModalOpen(false);
                userFormRef.current?.handleClose();
                displaySuccessNoti({ description: "Thêm người dùng thành công" });
            }
        });
    };

    const columns: ColumnsType<IUser> = [
        {
            title: "STT",
            key: "stt",
            align: "center",
            width: 60,
            fixed: true,
            render: (_, __, index) =>
                (data ? (data.pagination.currentPage - 1) * data.pagination.pageSize : 0) + index + 1
        },
        {
            title: "Người dùng",
            dataIndex: "name",
            width: 300,
            render: (value, { name, avatar, id }) => (
                <div className="flex gap-4 items-center">
                    <div className="size-[42px] rounded overflow-hidden">
                        {avatar ? (
                            <img src={avatar} className="w-full" alt="image" />
                        ) : (
                            <EmptyThumb text={name} fontSize="30px" className="size-full rounded-md" />
                        )}
                    </div>
                    <Link href={`/user/${id}`} className="text-ant-primary flex-1">
                        <span>{value}</span>
                    </Link>
                </div>
            )
        },
        {
            title: "Tài khoản",
            dataIndex: "username",
            sorter: true
        },
        {
            title: "Email",
            dataIndex: "email"
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone"
        },
        {
            title: "Link Facebook",
            dataIndex: "linkFacebook",
            width: 145,
            render: (value) => (
                <a href={value} target="_blank" className="text-ant-primary">
                    <FacebookOutlined />
                    <span className="ml-1.5">Facebook</span>
                </a>
            )
        },
        {
            title: "Tỉnh thành",
            dataIndex: "city",
            render: (value) => value?.name
        },
        {
            title: "Trường học",
            dataIndex: "school",
            width: 200,
            render: (value) => value?.name
        },
        {
            title: "Năm sinh",
            dataIndex: "yob",
            render: (_, { yearOfBirth }) => yearOfBirth,
            sorter: true
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 116,
            render: (value) => <StatusTag status={value} />
        },
        {
            key: "actions",
            width: 70,
            fixed: deviceType !== "mobile" ? "right" : undefined,
            render: (_, { id }) => (
                <div className="flex gap-2 flex-wrap justify-center">
                    {verifyACP(AuthACP.DeleteUser) && (
                        <Popconfirm
                            title="Bạn có muốn xóa người dùng này?"
                            onConfirm={() =>
                                deleteOneUserMutation.mutate(id, {
                                    onSuccess: () => {
                                        displaySuccessNoti({
                                            description: "Xóa người dùng thành công!"
                                        });
                                    },
                                    onError: (error) => {
                                        errorHandler(error);
                                    }
                                })
                            }
                            okButtonProps={{ loading: deleteOneUserMutation.isPending }}
                            okText={strings.confirm}
                            cancelText={strings.cancel}
                        >
                            <Tooltip color="#F25C5F" placement="left" title="Xoá người dùng">
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
            <FilterForm
                filterName="user"
                filter={{
                    name,
                    username,
                    phone,
                    yob,
                    cityId,
                    roleId,
                    status
                }}
                changeFilter={changeUserFilter}
                items={[
                    {
                        type: FilterFormItemType.Input,
                        name: "name",
                        label: "Họ và tên",
                        placeholder: "Họ và tên",
                        className: "!w-[260px]"
                    },
                    {
                        type: FilterFormItemType.Input,
                        name: "username",
                        label: "Tài khoản",
                        placeholder: "Tài khoản",
                        className: "!w-[260px]"
                    },
                    {
                        type: FilterFormItemType.Input,
                        name: "email",
                        label: "Email",
                        placeholder: "Email",
                        className: "!w-[260px]"
                    },
                    {
                        type: FilterFormItemType.Input,
                        name: "phone",
                        label: "Số điện thoại",
                        placeholder: "Số điện thoại",
                        className: "!w-[260px]"
                    },
                    {
                        type: FilterFormItemType.InputNumber,
                        name: "yob",
                        label: "Năm sinh",
                        placeholder: "Năm sinh",
                        className: "!w-[180px]"
                    },
                    {
                        type: FilterFormItemType.Select,
                        name: "cityId",
                        label: "Tỉnh thành",
                        placeholder: "Tỉnh thành",
                        showSearch: true,
                        options: cityExtraData.data?.cities
                            ? cityExtraData.data?.cities.map(({ id, name }) => ({ value: id, label: name }))
                            : []
                    },
                    {
                        type: FilterFormItemType.Select,
                        name: "roleId",
                        label: "Chức vụ",
                        placeholder: "Chức vụ",
                        showSearch: true,
                        options: authExtraData.data?.roles
                            ? authExtraData.data?.roles.map(({ id, name }) => ({ value: id, label: name }))
                            : []
                    },
                    {
                        type: FilterFormItemType.Select,
                        name: "status",
                        label: "Trạng thái",
                        placeholder: "Trạng thái",
                        className: "!w-[150px]",
                        options: EntityStateOptions
                    }
                ]}
            />
            {isPending ? (
                <AppLoadingView containerClassName="h-[60vh]" />
            ) : data ? (
                <div className="table-container">
                    <div className="title-table tab:mt-4 lap:mt-12">
                        <div className="title-table-pagination-tab">
                            <div>{getRange(data?.pagination)}</div>
                            <QueryPageSizeSelect
                                value={pageSize}
                                pageSizeOptions={PAGE_SIZE_OPTIONS}
                                onPageSizeChange={(newPageSize) => {
                                    changeUserFilter((prev) => ({
                                        ...prev,
                                        pageSize: newPageSize,
                                        page: 1
                                    }));
                                }}
                            />
                        </div>
                        <div className="title-table-actions">
                            <Divider type="vertical" className="hidden tab:inline h-auto bg-[#f0f0f0]" />
                            {verifyACP(AuthACP.CreateUser) && (
                                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                                    Thêm người dùng
                                </Button>
                            )}
                        </div>
                    </div>
                    <MainTable
                        dataSource={data?.users}
                        columns={columns}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        loading={isPending || isFetching}
                        pagination={false}
                        // rowSelection={{ type: "checkbox" }}
                        onChange={(_, __, sorter) =>
                            handleSort({
                                sorter,
                                handleOrderChange: (field, order) => {
                                    changeUserFilter((prev) => ({
                                        ...prev,
                                        sort: getSortQuery(field, order),
                                        page: 1
                                    }));
                                },
                                handleCancelSort: () => {
                                    changeUserFilter((prev) => {
                                        const newFilter = { ...prev };
                                        delete newFilter.sort;

                                        return {
                                            ...newFilter,
                                            page: 1
                                        };
                                    });
                                }
                            })
                        }
                    />
                    <QueryPagination
                        total={data?.pagination.total}
                        pageSize={data?.pagination.pageSize}
                        current={data?.pagination.currentPage}
                        onPageChange={(newPage) => {
                            changeUserFilter((prev) => ({
                                ...prev,
                                page: newPage
                            }));
                        }}
                    />
                </div>
            ) : null}
            {isError ? <ErrorEmpty /> : null}

            <Modal
                centered
                open={isModalOpen}
                title={"Tạo người dùng mới"}
                okText={strings.save}
                confirmLoading={isSubmitting}
                cancelText={strings.cancel}
                onCancel={() => {
                    setIsModalOpen(false);
                    userFormRef.current?.handleClose();
                }}
                onOk={handleCreateUser}
                width={1000}
                styles={{ content: { padding: 0 }, header: { padding: "20px 24px" }, footer: { padding: "20px 24px" } }}
            >
                <div className="max-h-[60vh] overflow-y-scroll px-5 scrollbar-y-light">
                    <UserForm ref={userFormRef} />
                </div>
            </Modal>
        </Block>
    );
};

export default UserView;
