"use client";

import { EditOutlined } from "@ant-design/icons";
import Block from "module/_core/app/component/Block";
import ErrorEmpty from "module/_core/app/component/Empty/ErrorEmpty";
import MainTable from "module/_core/app/component/Table/MainTable";
import QueryPageSizeSelect from "module/_core/app/component/Table/QueryPageSizeSelect";
import QueryPagination from "module/_core/app/component/Table/QueryPagination";
import StatusTag from "module/_core/app/component/Tag/StatusTag";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { getRange } from "module/_core/infras/util/pagination";
import useFilter from "module/_core/infras/hook/useFilter";
import { Button, Divider, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { ElementRef, useEffect, useRef } from "react";
import { HeaderService } from "@module/_core/app/layout/MainHeader/service";
import { BreadcrumbService } from "@module/_core/app/layout/MainBreadcrumb/service";
import { AppLoadingView } from "@module/_core/app/component/Loading/AppLoading";
import { keepPreviousData } from "@tanstack/react-query";
import UserAvatarTemplateForm from "./UserAvatarTemplateForm";
import { UserAvatarTemplateFilterDTO, UserAvatarTemplateDTO } from "@module/user/domain/dto/userAvatarTemplate";
import { UserAvatarTemplateService } from "@module/user/domain/service/userAvatarTemplate";
import { AuthService } from "@module/auth/domain/service/auth";
import { AuthACP } from "@module/auth/domain/config/accessControl/permission";

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const UserAvatarTemplateView = () => {
    const { setHeaderTitle } = HeaderService.useHeader(() => 0);
    const { setDefault } = BreadcrumbService.useBreadcrumb(() => 0);
    useEffect(() => {
        setHeaderTitle("Avatar");
        setDefault();
    }, []);

    const { verifyACP } = AuthService.useAuth();

    const { filter: userAvatarTemplateFilter, changeFilter: changeUserAvatarTemplateFilter } =
        useFilter<UserAvatarTemplateFilterDTO>();
    const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = userAvatarTemplateFilter;

    const { data, isPending, isFetching, isError } = UserAvatarTemplateService.useUserAvatarTemplate({
        filter: { page: page ?? 1, pageSize: pageSize ?? DEFAULT_PAGE_SIZE },
        fetcherOptions: {
            staleTime: 0,
            gcTime: 0,
            placeholderData: keepPreviousData,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });

    const userAvatarTemplateFormRef = useRef<ElementRef<typeof UserAvatarTemplateForm>>(null);

    const columns: ColumnsType<UserAvatarTemplateDTO> = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            align: "center",
            render: (_, __, index) =>
                (data ? (data.pagination.currentPage - 1) * data.pagination.pageSize : 0) + index + 1
        },
        {
            title: "Avatar",
            dataIndex: "name",
            render: (value, record) => (
                <div className="flex gap-4 items-center">
                    <div className="size-[42px] rounded overflow-hidden">
                        <img src={record.url} className="w-full" alt="image" />
                    </div>
                    <div
                        className="flex-1 cursor-pointer text-blue-500"
                        onClick={() =>
                            verifyACP(AuthACP.CreateUser) && userAvatarTemplateFormRef.current?.openUpdateForm(record)
                        }
                    >
                        <span>{value}</span>
                    </div>
                </div>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            align: "center",
            width: 120,
            render: (value) => <StatusTag status={value} />
        },
        {
            title: "",
            key: "actions",
            width: 65,
            render: (_, record) => (
                <div className="flex gap-3 justify-center">
                    {verifyACP(AuthACP.CreateUser) && (
                        <Tooltip color="#074173" placement="bottom" title="Chỉnh sửa Avatar">
                            <div
                                className="table-action-primary-btn"
                                onClick={() => userAvatarTemplateFormRef.current?.openUpdateForm(record)}
                            >
                                <EditOutlined />
                            </div>
                        </Tooltip>
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
                    <div className="title-table lap:mt-3">
                        <div>{getRange(data?.pagination)}</div>
                        <div className="flex gap-6">
                            <QueryPageSizeSelect
                                value={pageSize}
                                pageSizeOptions={PAGE_SIZE_OPTIONS}
                                onPageSizeChange={(newPageSize) => {
                                    changeUserAvatarTemplateFilter((prev) => ({
                                        ...prev,
                                        pageSize: newPageSize,
                                        page: 1
                                    }));
                                }}
                            />
                            {verifyACP(AuthACP.CreateUser) && (
                                <>
                                    <Divider type="vertical" className="h-auto bg-[#f0f0f0]" />
                                    <Button type="primary" onClick={userAvatarTemplateFormRef.current?.openCreateForm}>
                                        Thêm Avatar
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <MainTable
                        dataSource={data?.userAvatarTemplateList}
                        columns={columns}
                        loading={isFetching}
                        rowKey="id"
                        pagination={false}
                        scroll={{ x: "max-content" }}
                        className="overflow-x-auto"
                    />
                </div>
            ) : null}
            {isError && <ErrorEmpty />}
            <QueryPagination
                total={data?.pagination.total}
                pageSize={data?.pagination.pageSize}
                current={data?.pagination.currentPage}
                onPageChange={(newPage) => {
                    changeUserAvatarTemplateFilter((prev) => ({
                        ...prev,
                        page: newPage
                    }));
                }}
            />
            <UserAvatarTemplateForm ref={userAvatarTemplateFormRef} />
        </Block>
    );
};

export default UserAvatarTemplateView;
