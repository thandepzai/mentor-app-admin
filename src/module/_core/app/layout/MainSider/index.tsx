import { DropboxOutlined, HomeOutlined, LockOutlined, TeamOutlined, PictureOutlined } from "@ant-design/icons";
import { AuthACP } from "module/auth/domain/config/accessControl/permission";
import { AuthService } from "module/auth/domain/service/auth";
import { cleanArray } from "lib/util/functions";
import { Layout, Menu } from "antd";
import Link from "next/link";
import React, { useMemo, useRef } from "react";
import { IMenuItem } from "./data";
import { useWindowSize } from "@lib/hook/useWindowSize";
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
