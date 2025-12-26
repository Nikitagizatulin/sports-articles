import { Layout, Spin } from "antd";

export default function LoadingSpinner() {
    return (
        <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Spin size="large" />
        </Layout>
    );
}

