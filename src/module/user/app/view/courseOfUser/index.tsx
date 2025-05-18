"use client";

import Block from "@module/_core/app/component/Block";
import ErrorEmpty from "@module/_core/app/component/Empty/ErrorEmpty";
import MainTable from "@module/_core/app/component/Table/MainTable";
import MainTabs from "@module/_core/app/component/Tabs/MainTabs";
import StatusTag from "@module/_core/app/component/Tag/StatusTag";
import { errorHandler } from "@module/_core/infras/util/exceptionHandler";
import { AuthService } from "@module/auth/domain/service/auth";
import { CourseOfUserDTO } from "@module/user/domain/dto/courseOfUser";
import { CourseOfUserService } from "@module/user/domain/service/courseOfUser";
import { Button, Modal, Popconfirm, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { ElementRef, useRef, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { CourseACP } from "@module/course/domain/config/accessControl/permission";
import CourseOfUserForm from "./CourseOfUserForm";
import { displaySuccessNoti } from "@module/_core/infras/util/notification";
import strings from "@module/_core/infras/constant/strings";
import { AppLoadingView } from "@module/_core/app/component/Loading/AppLoading";
import EmptyThumb from "@module/_core/app/component/EmptyThumb";
import UserSummary from "../../components/UserSummary";
import { useParams } from "next/navigation";

const CourseOfUserView = () => {
    const { userId } = useParams() || {};

    const { verifyACP } = AuthService.useAuth();
    const [selectedCourseOfUserIds, setSlectedCourseOfUserIds] = useState<number[]>([]);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const courseOfUserFormRef = useRef<ElementRef<typeof CourseOfUserForm>>(null);

    const { data, isPending, isFetching, isError } = CourseOfUserService.useCourseOfUser(parseInt(userId as string), {
        fetcherOptions: {
            staleTime: 0,
            gcTime: 0,
            enabled: !!userId,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });

    const { removeCoursesOfUserMutation } = CourseOfUserService.useCourseOfUserAction();

    const columns: ColumnsType<CourseOfUserDTO> = [
        {
            title: "STT",
            key: "stt",
            align: "center",
            width: 60,
            fixed: true,
            render: (_, { id }) => data && data?.courses.findIndex((ele) => id === ele.id) + 1
        },
        {
            title: "Tên",
            dataIndex: "name",
            render: (value, { name, thumb, id }) => (
                <div className="flex gap-4 items-center">
                    <div className="size-[42px] rounded overflow-hidden">
                        {thumb ? (
                            <img src={thumb} className="w-full" alt="image" />
                        ) : (
                            <EmptyThumb text={name} fontSize="30px" className="size-full rounded-md" />
                        )}
                    </div>
                    <Link href={`/course/${id}`} className="text-ant-primary flex-1">
                        <span>{value}</span>
                    </Link>
                </div>
            )
        },
        {
            title: "Khối",
            dataIndex: "grade",
            render: (value) => value?.name
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (value) => <StatusTag status={value} />
        },
        {
            title: "Tiến trình học"
            // dataIndex: "description"
        },
        {
            title: "",
            key: "actions",
            width: 60,
            render: (_, record) => (
                <div className="flex gap-2 flex-wrap justify-center">
                    {verifyACP(CourseACP.UpdateEnroll) && (
                        <Popconfirm
                            title="Xoá khoá học dành cho học sinh này?"
                            onConfirm={() =>
                                removeCoursesOfUserMutation.mutate(
                                    { userId: parseInt(userId as string), body: { courseIds: [record.id] } },
                                    {
                                        onSuccess: () => {
                                            displaySuccessNoti({
                                                description: "Xóa khóa học khỏi học sinh thành công!"
                                            });
                                        },
                                        onError: (error) => {
                                            errorHandler(error);
                                        }
                                    }
                                )
                            }
                            okButtonProps={{ loading: removeCoursesOfUserMutation.isPending }}
                            okText={strings.confirm}
                            cancelText={strings.cancel}
                        >
                            <Tooltip color="#F25C5F" placement="left" title="Xoá khoá học">
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
            <UserSummary />
            <MainTabs
                itemTabs={[
                    { title: "Thông tin học sinh", href: `/user/${userId}` },
                    { title: "Danh sách khoá học" },
                    { title: "Vật phẩm", href: `/user/${userId}/item` }
                ]}
                className="mb-8"
            />
            <>
                {isPending ? (
                    <AppLoadingView containerClassName="h-[60vh]" />
                ) : data ? (
                    <div className="table-container">
                        <div className="title-table !flex-row !justify-end">
                            {verifyACP(CourseACP.UpdateEnroll) ? (
                                <>
                                    <Button type="primary" onClick={() => courseOfUserFormRef.current?.open()}>
                                        Thêm khoá học
                                    </Button>
                                    <Button
                                        type="primary"
                                        danger
                                        disabled={!selectedCourseOfUserIds.length}
                                        loading={removeCoursesOfUserMutation.isPending}
                                        onClick={() => setIsModalDeleteOpen(true)}
                                    >
                                        Xóa các khoá học đã chọn
                                    </Button>
                                </>
                            ) : null}
                        </div>
                        <MainTable
                            dataSource={data.courses}
                            columns={columns}
                            loading={isFetching}
                            rowKey="id"
                            scroll={{ x: "max-content" }}
                            pagination={false}
                            rowSelection={{
                                selectedRowKeys: selectedCourseOfUserIds,
                                type: "checkbox",
                                onChange: (selectedRowKeys: React.Key[]) => {
                                    setSlectedCourseOfUserIds(selectedRowKeys as number[]);
                                }
                            }}
                        />
                    </div>
                ) : null}
                {isError ? <ErrorEmpty /> : null}
            </>
            <CourseOfUserForm
                ref={courseOfUserFormRef}
                courseIdsOfUser={data ? data.courses?.map((item) => item.id) : []}
            />
            <Modal
                centered
                open={isModalDeleteOpen}
                title={"Xác nhận xoá các khoá học đã chọn?"}
                onOk={() =>
                    removeCoursesOfUserMutation.mutate(
                        {
                            userId: parseInt(userId as string),
                            body: { courseIds: selectedCourseOfUserIds }
                        },
                        {
                            onSuccess: () => {
                                displaySuccessNoti({
                                    description: "Xóa khoá học khỏi học sinh thành công!"
                                });
                                setSlectedCourseOfUserIds([]);
                                setIsModalDeleteOpen(false);
                            },
                            onError: (error) => {
                                errorHandler(error);
                            }
                        }
                    )
                }
                onCancel={() => setIsModalDeleteOpen(false)}
                okText={"Xóa"}
                cancelText={"Hủy"}
                okButtonProps={{
                    loading: removeCoursesOfUserMutation.isPending,
                    type: "text",
                    className: "bg-red-500 !text-white hover:!bg-red-400"
                }}
            />
        </Block>
    );
};

export default CourseOfUserView;
