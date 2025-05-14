import {
    ApartmentOutlined,
    ChromeOutlined,
    DropboxOutlined,
    FileImageOutlined,
    FileTextOutlined,
    HomeOutlined,
    LockOutlined,
    OrderedListOutlined,
    PlayCircleOutlined,
    TeamOutlined,
    UserOutlined,
    ShareAltOutlined,
    FileWordOutlined,
    CommentOutlined,
    StarOutlined,
    CreditCardOutlined,
    QuestionCircleOutlined,
    TagOutlined,
    GiftOutlined,
    GlobalOutlined,
    DatabaseOutlined,
    PictureOutlined
} from "@ant-design/icons";
import { AuthACP } from "module/auth/domain/config/accessControl/permission";
import { AuthService } from "module/auth/domain/service/auth";
import { CourseACP } from "module/course/domain/config/accessControl/permission";
import { OrderACP } from "module/order/domain/config/accessControl/permission";
import { UiACP } from "module/ui/domain/config/accessControl/permission";
import { cleanArray } from "lib/util/functions";
import { Layout, Menu } from "antd";
import Link from "next/link";
import React, { useMemo, useRef } from "react";
import { IMenuItem } from "./data";
import { QaACP } from "module/qa/domain/config/accessControl/permission";
import { useWindowSize } from "@lib/hook/useWindowSize";
import { EventACP } from "@module/event/domain/config/accessControl/permission";
import { CMSACP } from "@module/cms/domain/config/accessControl/permission";
import { usePathname } from "next/navigation";
interface MainSiderProps {
    isSiderCollapsed: boolean;
}

const MainSider = ({ isSiderCollapsed }: MainSiderProps) => {
    const pathname = usePathname();
    const { verifyACR, verifyACP } = AuthService.useAuth();
    const { deviceType } = useWindowSize();

    const leftSideBarRef = useRef<HTMLDivElement>(null);

    const MENU_ITEMS: IMenuItem[] = useMemo(() => {
        const handleMenuItems = (menuItems) => {
            return cleanArray(
                menuItems.map((item) => {
                    if (item.children) {
                        const subActiveMenu = handleMenuItems(item.children);
                        if (subActiveMenu.length == 0) return null;
                        else
                            return {
                                ...item,
                                children: subActiveMenu
                            };
                    } else if (item == false) return null;
                    else return item;
                }),
                [null]
            );
        };

        const menuItems = [
            verifyACP(AuthACP.ShowDevPage) && {
                key: "dev",
                label: "Dev Page",
                url: "/dev",
                icon: React.createElement(HomeOutlined)
            },
            {
                key: "home",
                label: "Home Page",
                url: "/",
                icon: React.createElement(HomeOutlined)
            },
            {
                key: "tool",
                label: "Tool",
                url: "/tool",
                icon: React.createElement(DropboxOutlined)
            },
            {
                key: "course-parent",
                label: "Khóa học",
                icon: React.createElement(PlayCircleOutlined),
                children: [
                    verifyACR(CourseACP.RESOURCE_COURSE) && {
                        key: "course",
                        label: "Khóa học",
                        url: "/course",
                        icon: React.createElement(PlayCircleOutlined)
                    },
                    verifyACR(CourseACP.RESOURCE_TEACHER) && {
                        key: "teacher",
                        label: "Giáo viên",
                        url: "/teacher",
                        icon: React.createElement(UserOutlined)
                    },
                    verifyACR(CourseACP.RESOURCE_CATEGORY) && {
                        key: "category",
                        label: "Danh mục",
                        url: "/category",
                        icon: React.createElement(ApartmentOutlined)
                    },
                    verifyACR(OrderACP.RESOURCE_CAMPAIN) && {
                        key: "campaign",
                        label: "Mã kích hoạt",
                        url: "/campaign",
                        icon: React.createElement(OrderedListOutlined)
                    }
                ]
            },
            {
                key: "user-parent",
                label: "Người dùng",
                icon: React.createElement(TeamOutlined),
                children: [
                    verifyACR(AuthACP.RESOURCE_USER) && {
                        key: "user",
                        label: "Người dùng",
                        url: "/user",
                        icon: React.createElement(TeamOutlined)
                    },
                    verifyACR(AuthACP.RESOURCE_USER) && {
                        key: "avatar-template",
                        label: "Avatar",
                        url: "/user/avatar-template",
                        icon: React.createElement(PictureOutlined)
                    }
                ]
            },
            {
                key: "auth",
                label: "Phân quyền",
                icon: React.createElement(LockOutlined),
                children: [
                    verifyACR(AuthACP.RESOURCE_PERMISSION) && {
                        key: "permission",
                        label: "Quyền",
                        url: "/permission",
                        icon: React.createElement(LockOutlined)
                    },
                    verifyACR(AuthACP.RESOURCE_ROLE) && {
                        key: "role",
                        label: "Chức vụ",
                        url: "/role",
                        icon: React.createElement(LockOutlined)
                    }
                ]
            },
            {
                key: "ui",
                label: "UI Website",
                icon: React.createElement(ChromeOutlined),
                children: [
                    verifyACR(UiACP.RESOURCE_USER_UI) && {
                        key: "home-slider",
                        label: "Banner Trang chủ",
                        url: "/ui/home-slider",
                        icon: React.createElement(FileImageOutlined)
                    },
                    verifyACR(UiACP.RESOURCE_USER_UI) && {
                        key: "hot-keyword",
                        label: "Hot Keyword",
                        url: "/ui/hot-keyword",
                        icon: React.createElement(ShareAltOutlined)
                    },
                    verifyACR(UiACP.RESOURCE_USER_UI) && {
                        key: "notification",
                        label: "Thông báo",
                        url: "/ui/notification",
                        icon: React.createElement(CreditCardOutlined)
                    }
                ]
            },
            {
                key: "test",
                label: "Thi thử",
                icon: React.createElement(FileTextOutlined),
                children: [
                    verifyACR(QaACP.RESOURCE_TEST) && {
                        key: "de-thi",
                        label: "Đề thi",
                        url: "/test",
                        icon: React.createElement(FileTextOutlined)
                    },
                    verifyACR(QaACP.RESOURCE_TEST) && {
                        key: "dau-truong",
                        label: "Đấu trường",
                        url: "/room-arena",
                        icon: React.createElement(TeamOutlined)
                    },
                    verifyACR(QaACP.RESOURCE_TEST) && {
                        key: "kho-dau-truong",
                        label: "Kho đấu trường",
                        url: "/room-arena-category",
                        icon: React.createElement(DatabaseOutlined)
                    },
                    verifyACR(QaACP.RESOURCE_TEST) && {
                        key: "test-category",
                        label: "Danh mục",
                        url: "/test-category",
                        icon: React.createElement(ApartmentOutlined)
                    }
                ]
            },
            {
                key: "questions",
                label: "Ngân hàng câu hỏi",
                icon: React.createElement(QuestionCircleOutlined),
                children: [
                    verifyACR(QaACP.RESOURCE_QUESTION) && {
                        key: "question-list",
                        label: "Câu hỏi",
                        url: "/questions",
                        icon: React.createElement(QuestionCircleOutlined)
                    },
                    verifyACR(QaACP.RESOURCE_TEST) && {
                        key: "question-library",
                        label: "Kho câu hỏi",
                        url: "/question-library",
                        icon: React.createElement(DatabaseOutlined)
                    },
                    verifyACR(QaACP.RESOURCE_TEST) && {
                        key: "qs-subject",
                        label: "Môn học",
                        url: "/questions/subject",
                        icon: React.createElement(PlayCircleOutlined)
                    },
                    verifyACR(QaACP.RESOURCE_TEST) && {
                        key: "tag",
                        label: "Tag",
                        url: "/questions/tag",
                        icon: React.createElement(TagOutlined)
                    }
                    // verifyACR(QaACP.RESOURCE_TEST) && {
                    //     key: "qs-category",
                    //     label: "Danh mục",
                    //     url: "/questions/category",
                    //     icon: React.createElement(ApartmentOutlined)
                    // }
                ]
            },
            {
                key: "cms",
                label: "CMS",
                icon: React.createElement(FileWordOutlined),
                children: [
                    verifyACR(CMSACP.RESOURCE_CMS) && {
                        key: "cms-blog",
                        label: "Bài viết",
                        url: "/cms/blog",
                        icon: React.createElement(FileWordOutlined)
                    },
                    verifyACR(CMSACP.RESOURCE_CMS) && {
                        key: "cms-category",
                        label: "Chuyên mục",
                        url: "/cms/category",
                        icon: React.createElement(ApartmentOutlined)
                    }
                ]
            },
            verifyACR(AuthACP.RESOURCE_INTERACTION) && {
                key: "comment",
                label: "Quản lý bình luận (Beta)",
                url: "/comment/course",
                icon: React.createElement(CommentOutlined)
            },
            verifyACR(EventACP.RESOURCE_EVENT) && {
                key: "event",
                label: "Quản lý sự kiện",
                url: "/event",
                icon: React.createElement(StarOutlined)
            },
            {
                key: "item",
                label: "Vật phẩm",
                icon: React.createElement(GiftOutlined),
                children: [
                    verifyACR(EventACP.RESOURCE_EVENT) && {
                        key: "consumption-item",
                        label: "Vật phẩm",
                        url: "/item",
                        icon: React.createElement(GiftOutlined)
                    },
                    verifyACR(EventACP.RESOURCE_EVENT) && {
                        key: "user-item",
                        label: "Vật phẩm người dùng",
                        url: "/item/user",
                        icon: React.createElement(TeamOutlined)
                    }
                ]
            },
            {
                key: "community",
                label: "Cộng đồng",
                icon: React.createElement(GlobalOutlined),
                children: [
                    verifyACR(CMSACP.RESOURCE_CMS) && {
                        key: "community-post",
                        label: "Bài viết",
                        url: "/community/post",
                        icon: React.createElement(FileWordOutlined)
                    }
                ]
            }
        ];

        return handleMenuItems(menuItems) as IMenuItem[];
    }, [verifyACR]);

    const defaultSelectedKeys = useMemo(() => {
        const flattenMenuItems = MENU_ITEMS.map((item) => (item.children ? item.children : item)).flat();
        const activeMenuItem = flattenMenuItems.find(({ url }) => url === pathname)?.key;
        return activeMenuItem ? [activeMenuItem] : [];
    }, [MENU_ITEMS, pathname]);

    const defaultOpenKeys = useMemo(() => {
        const activeSubMenuItem = MENU_ITEMS.find(({ children }) => {
            return children?.some(({ url }) => url === pathname);
        })?.key;
        return activeSubMenuItem ? [activeSubMenuItem] : [];
    }, [MENU_ITEMS, pathname]);

    const onShowScrollBar = () => {
        if (leftSideBarRef.current) {
            leftSideBarRef.current.className = leftSideBarRef.current.className.replace(
                "scrollbar-y-hidden",
                "scrollbar-y-dark"
            );
        }
    };

    const onHideScrollBar = () => {
        if (leftSideBarRef.current) {
            leftSideBarRef.current.className = leftSideBarRef.current.className.replace(
                "scrollbar-y-dark",
                "scrollbar-y-hidden"
            );
        }
    };

    return (
        <Layout.Sider
            width={270}
            collapsed={isSiderCollapsed}
            onMouseLeave={onHideScrollBar}
            onMouseEnter={onShowScrollBar}
            className="!fixed !z-30 !h-auto tab:!relative"
            style={{ minHeight: "100vh" }}
            collapsedWidth={deviceType === "mobile" ? 0 : "80px"}
        >
            <div
                className="sticky top-0 h-[100vh] overflow-auto scrollbar-y-hidden px-[3px]"
                style={{
                    scrollbarGutter: "stable both-edges"
                }}
                ref={leftSideBarRef}
            >
                <div className="h-16 pl-4.5 flex items-center gap-4">
                    <img src="/images/logo-128.png" alt="" className="h-9 w-9" />
                    {!isSiderCollapsed ? (
                        <span className="text-xl font-medium text-white whitespace-nowrap">MapStudy</span>
                    ) : null}
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={defaultSelectedKeys}
                    defaultOpenKeys={defaultOpenKeys}
                    className="font-medium !border-0"
                    items={MENU_ITEMS.map(({ key, label, icon, url, children }) => {
                        const isSubMenu = children?.length;
                        return {
                            key,
                            icon,
                            label: !isSubMenu ? <Link href={url ?? "#"}>{label}</Link> : label,
                            children: children?.map((child) => ({
                                ...child,
                                label: <Link href={child.url ?? "#"}>{child.label}</Link>
                            }))
                        };
                    })}
                />
            </div>
        </Layout.Sider>
    );
};

export default MainSider;
