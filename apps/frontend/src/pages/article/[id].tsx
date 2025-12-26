import { useQuery } from "@apollo/client/react";
import { initializeApollo } from "@/lib/apolloClient";
import { useRouter } from "next/router";
import Link from "next/link";
import { Typography, Button, Space, Result, Image } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ARTICLE_QUERY } from "@/graphql/articles";
import BackButton from "@/components/BackButton";
import PageLayout from "@/components/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";

const { Title, Paragraph } = Typography;
type Article = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string | null;
};

type ArticleQueryData = {
    article: Article | null;
};

type ArticleQueryVars = {
    id: string;
};

export async function getServerSideProps(ctx: any) {
    const apolloClient = initializeApollo();

    await apolloClient.query<ArticleQueryData, ArticleQueryVars>({
        query: ARTICLE_QUERY,
        variables: { id: ctx.params.id },
    });

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
        },
    };
}

export default function ArticlePage() {
    const router = useRouter();
    const { query } = router;
    const id = typeof query.id === "string" ? query.id : "";
    const { data, loading } = useQuery<ArticleQueryData, ArticleQueryVars>(ARTICLE_QUERY, {
        variables: { id },
    });

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

    return (
        <PageLayout>
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <BackButton />

                    <Title level={1}>{data.article.title}</Title>
                    
                    {data.article.imageUrl && (
                        <Image
                            src={data.article.imageUrl}
                            alt={data.article.title}
                            style={{ width: "100%", maxHeight: "400px" }}
                        />
                    )}

                    <Paragraph style={{ fontSize: "16px", whiteSpace: "pre-wrap" }}>
                        {data.article.content}
                    </Paragraph>

                    <Link href={`/article/${data.article.id}/edit`}>
                        <Button type="primary" icon={<EditOutlined />}>
                            Edit
                        </Button>
                    </Link>
                </Space>
        </PageLayout>
    );
}
