import { gql } from "@apollo/client";

export const ARTICLES_QUERY = gql`
  query Articles($limit: Int!, $cursor: ID) {
    articles(limit: $limit, cursor: $cursor) {
      items {
        id
        title
        createdAt
        imageUrl
      }
      nextCursor
    }
  }
`;

export const CREATE_ARTICLE_MUTATION = gql`
  mutation CreateArticle($input: ArticleInput!) {
    createArticle(input: $input) {
      id
      title
      content
      createdAt
      imageUrl
    }
  }
`;

export const ARTICLE_QUERY = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      title
      content
      imageUrl
      createdAt
    }
  }
`;

export const UPDATE_ARTICLE_MUTATION = gql`
  mutation UpdateArticle($id: ID!, $input: ArticleInput!) {
    updateArticle(id: $id, input: $input) {
      id
      title
      content
      imageUrl
      createdAt
    }
  }
`;

export const DELETE_ARTICLE_MUTATION = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id)
  }
`;
