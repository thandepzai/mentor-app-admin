import React, { Fragment } from "react";
import Link from "next/link";
import { BreadcrumbService } from "./service";
import clsx from "clsx";

const MainBreadcrumb = () => {
    const { data } = BreadcrumbService.useBreadcrumb();
    if (!data.items.length) return;

    return (
        <div className="bg-white px-4 pt-3 tab:pt-4 tab:px-4 lap:px-12 flex flex-nowrap items-center">
            {data.items.map((item, key) => (
                <Fragment key={key}>
                    <Link
                        href={item.href ?? ""}
                        className={clsx(
                            "text-cp text-slate-500 truncate hover:text-primary",
                            !item.href ? "!text-primary pointer-events-none" : "max-w-[20%]"
                        )}
                    >
                        {item.title}
                    </Link>
                    {item.href && <div className="text-cp text-slate-500 px-2">&gt;</div>}
                </Fragment>
            ))}
        </div>
    );
};

export default MainBreadcrumb;
