import { useQuery, useMutation } from "@apollo/client/react";
import { initializeApollo } from "@/lib/apolloClient";
import { ARTICLES_QUERY, DELETE_ARTICLE_MUTATION } from "@/graphql/articles";
import Link from "next/link";
import { List, Button, Space, Typography, Card, Empty, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PageLayout from "@/components/PageLayout";
import LoadingSpinner from "@/components/LoadingSpinner";

const { Title } = Typography;

type SportsArticle = {
  id: string;
  title: string;
  createdAt: string;
  imageUrl?: string | null;
};

type ArticlesQueryData = {
  articles: {
    items: SportsArticle[];
    nextCursor: string | null;
  };
};

type ArticlesQueryVars = {
  limit: number;
  cursor?: string | null;
};
type DeleteArticleData = { deleteArticle: boolean };
type DeleteArticleVars = { id: string };

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query<ArticlesQueryData, ArticlesQueryVars>({
    query: ARTICLES_QUERY,
    variables: { limit: 10 },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
export default function Home() {
  const { data, loading, fetchMore } = useQuery<ArticlesQueryData, ArticlesQueryVars>(ARTICLES_QUERY, {
    variables: { limit: 10 },
  });
  const [deleteArticle] = useMutation<DeleteArticleData, DeleteArticleVars>(DELETE_ARTICLE_MUTATION);
  async function onDelete(id: string) {
    Modal.confirm({
      title: "Delete article",
      content: "Are you sure you want to delete this article?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        const result = await deleteArticle({
          variables: { id },
          update(cache, result) {
            if (!result.data?.deleteArticle) return;

            cache.evict({ id: cache.identify({ __typename: "SportsArticle", id }) });
            cache.modify({
              fields: {
                articles(existing: any) {
                  if (!existing?.items) return existing;

                  return {
                    ...existing,
                    items: existing.items.filter((ref: any) => {
                      const refId = cache.identify(ref);
                      const targetId = cache.identify({ __typename: "SportsArticle", id });
                      return refId !== targetId;
                    }),
                  };
                },
              },
            });
            cache.gc();
          },
        });
        
        if (result.data?.deleteArticle) {
          message.success("Article deleted successfully");
        }
      },
    });
  }
  if (loading && !data) {
    return <LoadingSpinner />;
  }
  
  if (!data) {
    return (
      <PageLayout>
        <Empty description="No data" />
      </PageLayout>
    );
  }

  const { items, nextCursor } = data.articles;
  
  return (
    <PageLayout maxWidth="1200px">
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <Link href="/article/new">
            <Button type="primary" icon={<PlusOutlined />}>
              Create article
            </Button>
          </Link>

          <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
            dataSource={items}
            renderItem={(article: SportsArticle) => (
              <List.Item>
                <Card
                  style={{ width: "100%" }}
                  actions={[
                    <Link key="edit" href={`/article/${article.id}/edit`}>
                      <Button type="link" icon={<EditOutlined />}>
                        Edit
                      </Button>
                    </Link>,
                    <Button
                      key="delete"
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => onDelete(article.id)}
                    >
                      Delete
                    </Button>,
                  ]}
                >
                  <Link href={`/article/${article.id}`}>
                    <Title level={5} ellipsis={{ tooltip: article.title }}>
                      {article.title}
                    </Title>
                  </Link>
                </Card>
              </List.Item>
            )}
          />

          {nextCursor && (
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Button
                type="default"
                onClick={() =>
                  fetchMore({
                    variables: {
                      limit: 10,
                      cursor: nextCursor,
                    },
                  })
                }
                loading={loading}
              >
                Load more
              </Button>
            </div>
          )}
        </Space>
    </PageLayout>
  );
}
