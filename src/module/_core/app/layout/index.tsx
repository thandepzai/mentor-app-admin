import { ReactNode, memo, useEffect, useState } from "react";
import MainHeader from "./MainHeader";
import MainSider from "./MainSider";
import MainBreadcrumb from "./MainBreadcrumb";
import { useWindowSize } from "@lib/hook/useWindowSize";
import { Layout } from "antd";

interface MainLayoutProps {
    children?: ReactNode;
    customHeaderContent?: ReactNode;
}

const MainLayout = ({ children, customHeaderContent }: MainLayoutProps) => {
    const { deviceType } = useWindowSize();
    const [isSiderCollapsed, setIsSiderCollapsed] = useState(false);

    useEffect(() => {
        if (deviceType === "mobile" || deviceType === "tablet") setIsSiderCollapsed(true);
    }, [deviceType]);

    return (
        <Layout className="min-h-screen relative">
            <MainSider isSiderCollapsed={isSiderCollapsed} />
            <div
                className="size-full top-0 left-0 absolute z-10 bg-[#000000] duration-300 tab:hidden"
                onClick={() => setIsSiderCollapsed(true)}
                style={{ opacity: isSiderCollapsed ? 0 : 0.4, visibility: isSiderCollapsed ? "hidden" : "visible" }}
            />
            <Layout
                style={{
                    transitionDuration: "0.3s",
                    transitionTimingFunction: "ease-in-out"
                }}
            >
                <MainHeader
                    isSiderCollapsed={isSiderCollapsed}
                    setIsSiderCollapsed={setIsSiderCollapsed}
                    customContent={customHeaderContent}
                />
                <MainBreadcrumb />
                <Layout.Content className="p-0 bg-background">{children}</Layout.Content>
            </Layout>
        </Layout>
    );
};

export default memo(MainLayout);
