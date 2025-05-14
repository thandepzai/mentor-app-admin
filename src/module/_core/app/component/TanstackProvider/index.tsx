"use client";
import "@style/globals.css";
import { ThemeProvider } from "@style/antd.theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            structuralSharing: false,
            refetchOnWindowFocus: false
        }
    }
});

export default function TanstackProvider({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider theme={ThemeProvider}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </ConfigProvider>
        </QueryClientProvider>
    );
}
