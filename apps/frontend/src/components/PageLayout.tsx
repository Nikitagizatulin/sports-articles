import { Layout } from "antd";
import { ReactNode } from "react";

const { Content } = Layout;

interface PageLayoutProps {
    children: ReactNode;
    maxWidth?: string;
}

export default function PageLayout({ children, maxWidth = "800px" }: PageLayoutProps) {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Content style={{ padding: "24px", maxWidth, margin: "0 auto", width: "100%" }}>
                {children}
            </Content>
        </Layout>
    );
}

