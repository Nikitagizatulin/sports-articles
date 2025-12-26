import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client/react";
import { initializeApollo } from "@/lib/apolloClient";
import { ConfigProvider } from "antd";
import { StyleProvider } from '@ant-design/cssinjs';

export default function App({ Component, pageProps }: AppProps) {
  const client = initializeApollo(pageProps.initialApolloState);
  return (
    <ConfigProvider>
      <ApolloProvider client={client}>
        <StyleProvider hashPriority="high">
          <Component {...pageProps} />
        </StyleProvider>
      </ApolloProvider>
    </ConfigProvider>
  );
}
