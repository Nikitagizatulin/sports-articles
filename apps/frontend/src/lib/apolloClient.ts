import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

let apolloClient: ApolloClient | null = null;

function createApolloClient() {
    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_URL
        }),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        articles: {
                            keyArgs: false,
                            merge(existing, incoming) {
                                if (!existing) return incoming;
                                return {
                                    ...incoming,
                                    items: [...existing.items, ...incoming.items],
                                };
                            },
                        },
                    },
                },
            },
        }),
    });
}

export function initializeApollo(initialState: any = null) {
    const _apolloClient = apolloClient ?? createApolloClient();

    if (initialState) {
        _apolloClient.cache.restore(initialState);
    }

    if (typeof window === "undefined") return _apolloClient;
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}
