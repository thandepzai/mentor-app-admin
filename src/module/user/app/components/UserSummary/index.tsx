import EmptyThumb from "@module/_core/app/component/EmptyThumb";
import { BreadcrumbService } from "@module/_core/app/layout/MainBreadcrumb/service";
import { HeaderService } from "@module/_core/app/layout/MainHeader/service";
import { errorHandler } from "@module/_core/infras/util/exceptionHandler";
import { UserService } from "@module/user/domain/service/user";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UserSummary = () => {
    const router = useRouter();
    const { userId } = useParams() || {};
    const pathname = usePathname();

    const { setHeaderTitle } = HeaderService.useHeader(() => 0);
    const { setBreadcrumbItems } = BreadcrumbService.useBreadcrumb(() => 0);

    const { data } = UserService.useUserDetail(parseInt(userId as string), {
        fetcherOptions: {
            staleTime: 60 * 1 * 1000,
            gcTime: 60 * 1 * 1000,
            enabled: !!userId,
            onError: (error) => {
                errorHandler(error);
            }
        }
    });

    useEffect(() => {
        if (data) {
            setHeaderTitle(data.name, "/user");

            const breadcrumbMapping = {
                "/course": "Danh sách khoá học",
                "/item": "Vật phẩm"
            };
            const matchedPath = Object.keys(breadcrumbMapping).find((path) => pathname.includes(path));
            const breadcrumbTitle = matchedPath ? breadcrumbMapping[matchedPath] : "Thông tin học sinh";

            setBreadcrumbItems([
                { title: "Tất cả học sinh", href: "/user" },
                { title: data.name, href: `/user/${userId}` },
                { title: breadcrumbTitle }
            ]);
        }
    }, [data, router]);

    return (
        !!data && (
            <div className="-mt-4 mb-12 rounded-lg flex gap-5">
                {data.avatar ? (
                    <img src={data.avatar} alt="" className="size-24 rounded-lg" />
                ) : (
                    <EmptyThumb text={data.name} fontSize="45px" className="size-24 rounded-md" />
                )}
                <div className="flex flex-col gap-2">
                    <div className="font-medium text-xl">{data.name}</div>
                    <div className="flex">
                        <div className="font-medium mr-2">Sđt:</div>
                        <div className="flex-1">{data.phone}</div>
                    </div>
                    <div className="flex">
                        <div className="font-medium mr-2">Email:</div>
                        <div className="flex-1">{data.email}</div>
                    </div>
                </div>
            </div>
        )
    );
};

export default UserSummary;
