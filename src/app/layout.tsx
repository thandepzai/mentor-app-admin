import TanstackProvider from "@module/_core/app/component/TanstackProvider";
import AppWrapper from "@module/_core/app/component/AppWrapper";

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <meta
                    name="viewport"
                    content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=no"
                />
            </head>
            <body className="font-sans">
                <TanstackProvider>
                    <AppWrapper>{children}</AppWrapper>
                </TanstackProvider>
            </body>
        </html>
    );
}
