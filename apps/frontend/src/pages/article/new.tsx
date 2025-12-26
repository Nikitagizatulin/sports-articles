import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client/react";
import { CREATE_ARTICLE_MUTATION } from "@/graphql/articles";
import { Form, Input, Button, Typography, Space } from "antd";
import BackButton from "@/components/BackButton";
import PageLayout from "@/components/PageLayout";
import ErrorAlert from "@/components/ErrorAlert";
import { getGraphQLErrorMessage } from "@/utils/errorUtils";

const { Title } = Typography;
const { TextArea } = Input;

type CreateArticleData = {
    createArticle: {
        id: string;
        title: string;
        content: string;
        createdAt: string;
        imageUrl?: string | null;
    };
};

type CreateArticleVars = {
    input: {
        title: string;
        content: string;
        imageUrl?: string | null;
    };
};

export default function NewArticlePage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [clientError, setClientError] = useState<string | null>(null);

    const [createArticle, { loading, error }] = useMutation<CreateArticleData, CreateArticleVars>(
        CREATE_ARTICLE_MUTATION
    );

    const serverError = useMemo(() => (error ? getGraphQLErrorMessage(error) : null), [error]);

    async function onSubmit() {
        setClientError(null);

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle) {
            setClientError("Title is required.");
            return;
        }
        if (!trimmedContent) {
            setClientError("Content is required.");
            return;
        }

        const res = await createArticle({
            variables: {
                input: {
                    title: trimmedTitle,
                    content: trimmedContent,
                    imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
                },
            },
        });

        const newId = res.data?.createArticle.id;
        if (newId) {
            await router.push(`/article/${newId}`);
        }
    }

    return (
        <PageLayout>
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <BackButton />

                <Title level={2}>Create article</Title>

                <ErrorAlert description={clientError || serverError || ""} />

                    <Form layout="vertical" onFinish={onSubmit}>
                        <Form.Item label="Title" required>
                            <Input
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                disabled={loading}
                                placeholder="Enter article title"
                            />
                        </Form.Item>

                        <Form.Item label="Content" required>
                            <TextArea
                                value={content}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                disabled={loading}
                                rows={8}
                                placeholder="Enter article content"
                            />
                        </Form.Item>

                        <Form.Item label="Image URL">
                            <Input
                                value={imageUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                                disabled={loading}
                                placeholder="https://..."
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Create
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
        </PageLayout>
    );
}
