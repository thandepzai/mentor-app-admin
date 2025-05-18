"use client";

import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import Block from "@module/_core/app/component/Block";
import strings from "@module/_core/infras/constant/strings";
import useFilter from "@module/_core/infras/hook/useFilter";
import { errorHandler } from "@module/_core/infras/util/exceptionHandler";
import { displaySuccessNoti } from "@module/_core/infras/util/notification";
import { AuthService } from "@module/auth/domain/service/auth";
import { EventACP } from "@module/event/domain/config/accessControl/permission";
import { keepPreviousData } from "@tanstack/react-query";
import { Button, Divider, Popconfirm, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { ElementRef, useEffect, useRef } from "react";
import ItemOfUserForm from "./ItemOfUserForm";
import MainTable from "@module/_core/app/component/Table/MainTable";
import { getRange } from "@module/_core/infras/util/pagination";
import QueryPageSizeSelect from "@module/_core/app/component/Table/QueryPageSizeSelect";
import QueryPagination from "@module/_core/app/component/Table/QueryPagination";
import ErrorEmpty from "@module/_core/app/component/Empty/ErrorEmpty";
import { AppLoadingView } from "@module/_core/app/component/Loading/AppLoading";
import FilterForm from "@module/_core/app/component/FilterForm";
import { FilterFormItemType } from "@module/_core/app/component/FilterForm/type";
import { UserItemDTO, UserItemFilterDTO } from "@module/item/domain/dto/userItem";
import { UserItemService } from "@module/item/domain/service/userItem";
import { StatusUserItemOption } from "@module/item/domain/config/type/StatusUserItemType";
import { formatTimeString } from "@module/_core/infras/util/time";
import { ItemService } from "@module/item/domain/service/item";
import { useParams } from "next/navigation";
import MainTabs from "@module/_core/app/component/Tabs/MainTabs";
import UserSummary from "../../components/UserSummary";

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const ItemOfUserView = () => {
    const { userId } = useParams() || {};
    const { verifyACP } = AuthService.useAuth();

    const {
        filter: { page = 1, pageSize = DEFAULT_PAGE_SIZE, itemId, usable, username, status },
        changeFilter: changeUserItemFilter
    } = useFilter<UserItemFilterDTO>();

    const { deleteOneUserItemMutation } = UserItemService.useUserItemAction();
    const itemOfUserForm = useRef<ElementRef<typeof ItemOfUserForm>>(null);

    const { data: itemData } = ItemService.useItem({
        filter: {
            page: 1,
            pageSize: -1
        },
        fetcherOptions: {
            staleTime: 0,
            gcTime: 0,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });

    const { data, isPending, isFetching, isError } = UserItemService.useUserItem({
        filter: {
            page: page ?? 1,
            pageSize: pageSize ?? DEFAULT_PAGE_SIZE,
            sort: "-order",
            itemId,
            usable,
            userId: Number(userId),
            status
        },
        fetcherOptions: {
            staleTime: 0,
            gcTime: 0,
            enabled: !!userId,
            placeholderData: keepPreviousData,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });

    const tableColumns: ColumnsType<UserItemDTO> = [
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
            dataIndex: ["user", "name"],
            width: "24%",
            render: (value, record) => (
                <div className="flex gap-4 items-center">
                    {record.user.avatar && <img src={record.user.avatar} alt="" className="size-[42px] rounded" />}
                    <button
                        onClick={() =>
                            verifyACP(EventACP.UpdateEvent) && itemOfUserForm.current?.openUpdateForm(record)
                        }
                        className="text-ant-primary"
                    >
                        {value}
                    </button>
                </div>
            )
        },
        {
            title: "Vật phẩm",
            dataIndex: ["item", "name"],
            width: "24%",
            render: (value, record) => (
                <div className="flex gap-4 items-center">
                    {record.item.image && <img src={record.item.image} alt="" className="size-[42px] rounded" />}
                    <button
                        onClick={() =>
                            verifyACP(EventACP.UpdateEvent) && itemOfUserForm.current?.openUpdateForm(record)
                        }
                        className="text-ant-primary"
                    >
                        {value}
                    </button>
                </div>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (value) => <>{StatusUserItemOption.find((item) => item.value === value)?.label}</>
        },
        {
            title: "Ngày nhận",
            dataIndex: "activatedAt",
            render: (value) => formatTimeString(value)
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "expiredAt",
            render: (value) => formatTimeString(value)
        },
        {
            title: "",
            key: "actions",
            width: 75,
            render: (_, record) =>
                verifyACP(EventACP.UpdateEvent) && (
                    <div className="flex gap-2 flex-wrap justify-center">
                        <Tooltip color="#074173" placement="bottom" title="Chỉnh sửa vật phẩm">
                            <div
                                className="table-action-primary-btn"
                                onClick={() => itemOfUserForm?.current?.openUpdateForm(record)}
                            >
                                <EditOutlined />
                            </div>
                        </Tooltip>
                        <Popconfirm
                            title="Xóa vật phẩm?"
                            onConfirm={() =>
                                deleteOneUserItemMutation.mutate(record.id, {
                                    onSuccess: () => {
                                        displaySuccessNoti({
                                            description: "Xóa thành công!"
                                        });
                                    },
                                    onError: (error) => {
                                        errorHandler(error);
                                    }
                                })
                            }
                            okButtonProps={{ loading: deleteOneUserItemMutation.isPending }}
                            okText={strings.confirm}
                            cancelText={strings.cancel}
                        >
                            <Tooltip color="#F25C5F" placement="bottom" title="Xoá vật của phẩm">
                                <div className="table-action-error-btn">
                                    <CloseOutlined />
                                </div>
                            </Tooltip>
                        </Popconfirm>
                    </div>
                )
        }
    ];

    return (
        <Block>
            <UserSummary />
            <MainTabs
                itemTabs={[
                    { title: "Thông tin học sinh", href: `/user/${userId}` },
                    { title: "Danh sách khoá học", href: `/user/${userId}/course` },
                    { title: "Vật phẩm" }
                ]}
                className="mb-8"
            />
            <FilterForm<UserItemFilterDTO>
                filterName="user-item"
                filter={{ itemId, usable, username, status }}
                changeFilter={changeUserItemFilter}
                items={[
                    {
                        type: FilterFormItemType.Select,
                        name: "itemId",
                        label: "Vật phẩm",
                        placeholder: "Vật phẩm",
                        className: "!w-[250px]",
                        showSearch: true,
                        options: itemData?.consumptionItems.map((item) => ({ value: item.id, label: item.name })) ?? []
                    },
                    {
                        type: FilterFormItemType.Tag,
                        name: "usable",
                        label: "Có thể sủ dụng",
                        options: [
                            { value: true, label: "Có" },
                            { value: false, label: "Không" }
                        ]
                    },
                    {
                        type: FilterFormItemType.Select,
                        name: "status",
                        label: "Trạng thái",
                        placeholder: "Trạng thái",
                        className: "!w-[250px]",
                        options: StatusUserItemOption
                    }
                ]}
            />
            {isPending ? (
                <AppLoadingView containerClassName="h-[60vh]" />
            ) : data ? (
                <div className="table-container">
                    <div className="title-table tab:mt-4 lap:mt-8">
                        <div className="title-table-pagination-tab">
                            <div>{getRange(data?.pagination)}</div>
                            <QueryPageSizeSelect
                                value={data?.pagination.pageSize}
                                pageSizeOptions={PAGE_SIZE_OPTIONS}
                                onPageSizeChange={(newPageSize) => {
                                    changeUserItemFilter((prev) => ({
                                        ...prev,
                                        pageSize: newPageSize,
                                        page: 1
                                    }));
                                }}
                            />
                        </div>
                        {verifyACP(EventACP.CreateEvent) && (
                            <div className="title-table-actions">
                                <Divider type="vertical" className="hidden tab:inline h-auto bg-[#f0f0f0]" />
                                <Button
                                    type="primary"
                                    className="py-1.5"
                                    onClick={() => itemOfUserForm.current?.openCreateForm()}
                                >
                                    Thêm vật phầm
                                </Button>
                            </div>
                        )}
                    </div>
                    <MainTable
                        dataSource={data?.inventories}
                        columns={tableColumns}
                        rowKey="id"
                        scroll={{ x: "max-content" }}
                        loading={isFetching}
                        pagination={false}
                    />
                    <QueryPagination
                        total={data?.pagination.total}
                        pageSize={data?.pagination.pageSize}
                        current={data?.pagination.currentPage}
                        onPageChange={(newPage) => {
                            changeUserItemFilter((prev) => ({
                                ...prev,
                                page: newPage
                            }));
                        }}
                    />
                </div>
            ) : null}
            {isError && <ErrorEmpty />}
            <ItemOfUserForm ref={itemOfUserForm} items={itemData?.consumptionItems} userId={Number(userId)} />
        </Block>
    );
};

export default ItemOfUserView;
