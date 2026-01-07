import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client/react";
import { ARTICLE_QUERY, UPDATE_ARTICLE_MUTATION, DELETE_ARTICLE_MUTATION } from "@/graphql/articles";
import { Form, Input, Button, Typography, Space, Result, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import BackButton from "@/components/BackButton";
import PageLayout from "@/components/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorAlert from "@/components/ErrorAlert";
import { getGraphQLErrorMessage } from "@/utils/errorUtils";

const { Title } = Typography;
const { TextArea } = Input;

type Article = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
};

type ArticleQueryData = { article: Article | null };
type ArticleQueryVars = { id: string };

type UpdateArticleData = { updateArticle: Article };
type UpdateArticleVars = {
    id: string;
    input: { title: string; content: string; imageUrl?: string | null };
};

type DeleteArticleData = { deleteArticle: boolean };
type DeleteArticleVars = { id: string };

export default function EditArticlePage() {
    const router = useRouter();
    const id = typeof router.query.id === "string" ? router.query.id : "";

    const { data, loading, error } = useQuery<ArticleQueryData, ArticleQueryVars>(ARTICLE_QUERY, {
        variables: { id },
        skip: !id,
    });

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Prefill when article loaded
    useEffect(() => {
        const a = data?.article;
        if (!a) return;
        setTitle(a.title ?? "");
        setContent(a.content ?? "");
        setImageUrl(a.imageUrl ?? "");
    }, [data?.article?.id]); // only when record changes

    const [clientError, setClientError] = useState<string | null>(null);

    const [updateArticle, updateState] = useMutation<UpdateArticleData, UpdateArticleVars>(
        UPDATE_ARTICLE_MUTATION
    );

    const [deleteArticle, deleteState] = useMutation<DeleteArticleData, DeleteArticleVars>(
        DELETE_ARTICLE_MUTATION
    );

    const serverError = useMemo(() => {
        const err = updateState.error || deleteState.error || error;
        return err ? getGraphQLErrorMessage(err) : null;
    }, [updateState.error, deleteState.error, error]);

    async function onSubmit() {
        setClientError(null);

        const t = title.trim();
        const c = content.trim();

        if (!t) return setClientError("Title is required.");
        if (!c) return setClientError("Content is required.");

        const res = await updateArticle({
            variables: {
                id,
                input: {
                    title: t,
                    content: c,
                    imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
                },
            },
        });

        const updatedId = res.data?.updateArticle.id;
        if (updatedId) {
            await router.push(`/article/${updatedId}`);
        }
    }

    async function onDelete() {
        setClientError(null);

        if (!id) return;
        
        Modal.confirm({
            title: "Delete article",
            content: "Are you sure you want to delete this article?",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    const res = await deleteArticle({ variables: { id } });
                    if (res.data?.deleteArticle) {
                        message.success("Article deleted successfully");
                        await router.push(`/`);
                    }
                } catch (error) {
                    message.error("Failed to delete article. Please try again.");
                    console.error("Delete error:", error);
                }
            },
        });
    }

    if (!id) {
        return (
            <PageLayout>
                <Result status="error" title="Invalid ID" />
            </PageLayout>
        );
    }

    if (loading && !data) {
        return <LoadingSpinner />;
    }

    if (!data?.article) {
        return (
            <PageLayout>
                <Result status="404" title="Article not found" />
            </PageLayout>
        );
    }

    const isBusy = updateState.loading || deleteState.loading;

    return (
        <PageLayout>
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <BackButton />

                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={onDelete}
                            loading={deleteState.loading}
                            disabled={isBusy}
                        >
                            Delete
                        </Button>
                    </Space>

                    <Title level={2}>Edit article</Title>

                    <ErrorAlert description={clientError || serverError || ""} />

                    <Form layout="vertical" onFinish={onSubmit}>
                        <Form.Item label="Title" required>
                            <Input
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                disabled={isBusy}
                                placeholder="Enter article title"
                            />
                        </Form.Item>

                        <Form.Item label="Content" required>
                            <TextArea
                                value={content}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                disabled={isBusy}
                                rows={8}
                                placeholder="Enter article content"
                            />
                        </Form.Item>

                        <Form.Item label="Image URL">
                            <Input
                                value={imageUrl}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                                disabled={isBusy}
                                placeholder="https://..."
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={updateState.loading} disabled={isBusy}>
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
        </PageLayout>
    );
}
