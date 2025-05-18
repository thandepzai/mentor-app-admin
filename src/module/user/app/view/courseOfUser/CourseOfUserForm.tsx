import { SearchOutlined } from "@ant-design/icons";
import ErrorEmpty from "@module/_core/app/component/Empty/ErrorEmpty";
import MainTable from "@module/_core/app/component/Table/MainTable";
import strings from "@module/_core/infras/constant/strings";
import { errorHandler } from "@module/_core/infras/util/exceptionHandler";
import { displaySuccessNoti } from "@module/_core/infras/util/notification";
import { ICourse } from "@module/course/domain/model/course";
import { CustomCourseService } from "@module/course/domain/service/custom";
import { CourseOfUserService } from "@module/user/domain/service/courseOfUser";
import { Button, ConfigProvider, Input, InputRef, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import { useParams } from "next/navigation";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface CourseOfUserFormHandler {
    open: () => void;
}

interface CourseOfUserFormProps {
    courseIdsOfUser: number[];
}

const CourseOfUserForm = forwardRef<CourseOfUserFormHandler, CourseOfUserFormProps>(({ courseIdsOfUser }, ref) => {
    const { userId } = useParams() || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef<InputRef>(null);

    const courseExtraData = CustomCourseService.useCourseExtraData();
    const { addCoursesToUserMutation } = CourseOfUserService.useCourseOfUserAction();

    useImperativeHandle(ref, () => ({
        open: () => setIsModalOpen(true)
    }));

    const handleAddCoursesToUser = () => {
        addCoursesToUserMutation.mutate(
            {
                userId: parseInt(userId as string),
                body: { courseIds: selectedCourseIds }
            },
            {
                onSuccess: () => {
                    displaySuccessNoti({
                        description: "Thêm khóa học thành công!"
                    });
                    setSelectedCourseIds([]);
                },
                onError: (error) => {
                    errorHandler(error);
                }
            }
        );
    };

    const columns: ColumnsType<ICourse> = [
        {
            title: "STT",
            key: "stt",
            width: 70,
            align: "center",
            render: (_, __, index) => <span>{index + 1}</span>
        },
        {
            title: "Tên khóa học",
            dataIndex: "name",
            width: "100%",
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
                <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                    <Input
                        ref={searchInput}
                        placeholder="Nhập tên khóa học"
                        className="w-72"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => {
                            setSearchText(selectedKeys[0] as string);
                            confirm();
                        }}
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            onClick={() => {
                                setSearchText(selectedKeys[0] as string);
                                confirm();
                            }}
                            icon={<SearchOutlined />}
                            size="small"
                            className="grow"
                        >
                            Tìm
                        </Button>
                        <Button
                            onClick={() => {
                                if (!clearFilters) return;
                                clearFilters();
                                setSearchText(selectedKeys[0] as string);
                                confirm();
                            }}
                            size="small"
                            className="grow"
                        >
                            Reset
                        </Button>
                        <Button onClick={() => close()} size="small" className="grow">
                            Hủy
                        </Button>
                    </div>
                </div>
            ),
            filterIcon: (filtered: boolean) => (
                <div
                    className={`px-4 py-1 border border-ant-primary rounded flex gap-2 ${
                        filtered ? "bg-ant-primary text-white" : "text-ant-primary"
                    }`}
                >
                    <span className="">Tìm kiếm</span>
                    <SearchOutlined />
                </div>
            ),
            onFilter: (value, record) =>
                record.name
                    .toString()
                    .toLowerCase()
                    .includes((value as string).toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            }
        }
    ];

    return (
        <Modal
            open={isModalOpen}
            title="Thêm khoá học cho học sinh"
            okText="Thêm các khoá học đã chọn"
            confirmLoading={addCoursesToUserMutation.isPending}
            cancelText={strings.cancel}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleAddCoursesToUser}
            width={1000}
            styles={{ content: { padding: 0 }, header: { padding: "20px 24px" }, footer: { padding: "20px 24px" } }}
        >
            <div className="h-[60vh] overflow-y-scroll px-5 scrollbar-y-light">
                <ConfigProvider renderEmpty={courseExtraData.isError ? ErrorEmpty : undefined}>
                    <div className="flex justify-between items-center px-1 mb-5">
                        <span className="font-semibold text-base">Chọn các khóa học</span>
                        {searchText ? (
                            <div className="text-ant-primary italic text-base">
                                Kết quả cho từ khóa &quot;{searchText}&quot;
                            </div>
                        ) : null}
                    </div>
                    <MainTable
                        dataSource={courseExtraData.data?.courses.filter(
                            (item) => !courseIdsOfUser?.includes(item.id) && item.status
                        )}
                        columns={columns}
                        virtual={true}
                        scroll={{ x: 800 }}
                        pagination={false}
                        rowKey="id"
                        loading={courseExtraData.isPending || courseExtraData.isFetching}
                        rowSelection={{
                            selectedRowKeys: selectedCourseIds,
                            type: "checkbox",
                            onChange: (selectedRowKeys: React.Key[]) => {
                                setSelectedCourseIds(selectedRowKeys as number[]);
                            }
                        }}
                    />
                </ConfigProvider>
            </div>
        </Modal>
    );
});

export default CourseOfUserForm;
