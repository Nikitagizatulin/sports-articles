export function getGraphQLErrorMessage(err: any): string {
    const msg = err?.graphQLErrors?.[0]?.message;
    return msg || err?.message || "Something went wrong.";
}

