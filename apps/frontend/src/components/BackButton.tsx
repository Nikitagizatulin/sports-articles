import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export default function BackButton() {
    const router = useRouter();

    return (
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            Back
        </Button>
    );
}

