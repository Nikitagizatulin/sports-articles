export const typeDefs = `#graphql
  scalar DateTime

  type SportsArticle {
    id: ID!
    title: String!
    content: String!
    imageUrl: String
    createdAt: DateTime!
    deletedAt: DateTime
  }

  input ArticleInput {
    title: String!
    content: String!
    imageUrl: String
  }

  type ArticlesResult {
    items: [SportsArticle!]!
    nextCursor: ID
  }

  type Query {
    articles(limit: Int = 10, cursor: ID): ArticlesResult!
    article(id: ID!): SportsArticle
  }

  type Mutation {
    createArticle(input: ArticleInput!): SportsArticle!
    updateArticle(id: ID!, input: ArticleInput!): SportsArticle!
    deleteArticle(id: ID!): Boolean!
  }
`;
