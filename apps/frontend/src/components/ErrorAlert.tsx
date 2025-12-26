import { Alert } from "antd";

interface ErrorAlertProps {
    message?: string;
    description: string;
}

export default function ErrorAlert({ message = "Error", description }: ErrorAlertProps) {
    if (!description) return null;
    
    return (
        <Alert
            title={message}
            description={description}
            type="error"
            showIcon
        />
    );
}

