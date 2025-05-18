"use client";

import MainLayout from "module/_core/app/layout";
import { AuthService } from "module/auth/domain/service/auth";
import { useIsomorphicLayoutEffect } from "@react-pdf-viewer/core";
import dynamic from "next/dynamic";
import { SystemService } from "@module/_core/domain/service/config/system";
import LoadingOverlay from "../Loading/LoadingOverlay";
import { useInitWindownSize } from "@lib/hook/useWindowSize";
import { usePathname, useRouter } from "next/navigation";

interface AppWrapperProps {
    children: React.ReactNode;
}

const AnonyMousComponentHook = () => {
    const { isInit } = useInitWindownSize();

    useIsomorphicLayoutEffect(() => {
        if (isInit) {
            document.getElementById("root")?.classList.remove("invisible");
        }
    }, [isInit]);

    return null;
};

const AppWrapper = ({ children }: AppWrapperProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = AuthService.useAuth();
    const { verifyAuthMutation } = AuthService.useAuthAction();
    const { data } = SystemService.useSystem();

    useIsomorphicLayoutEffect(() => {
        if (user) verifyAuthMutation.mutate();
    }, []);

    if (pathname == "/login") {
        if (user) {
            router.push("/");
            return null;
        }
        return <>{children}</>;
    } else if (!user) {
        router.push("/login");
        return null;
    }

    return (
        <div id="root" className="invisible">
            <MainLayout key={data}>
                <LoadingOverlay />
                {children}
                <AnonyMousComponentHook />
            </MainLayout>
        </div>
    );
};

export default dynamic(() => Promise.resolve(AppWrapper), {
    ssr: false
});
