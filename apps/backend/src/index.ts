import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers";
import { GraphQLError } from "graphql";
import { prisma, Context } from "../prisma";

async function start() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    const server = new ApolloServer<Context>({
        typeDefs,
        resolvers,
        // Optional: ensure unexpected errors are not ugly
        formatError: (formattedError, error) => {
            // If it's already a GraphQLError we threw (BAD_USER_INPUT, NOT_FOUND), keep it readable
            if (error instanceof GraphQLError) return formattedError;

            // Otherwise hide internals
            return {
                message: "Internal server error",
                locations: formattedError.locations,
                path: formattedError.path,
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            };
        },
    });

    await server.start();

    app.get("/health", (_req, res) => res.json({ ok: true }));

    app.use(
        "/graphql",
        expressMiddleware(server, {
            context: async () => ({ prisma }),
        })
    );

    const port = Number(process.env.PORT ?? 4000);
    app.listen(port, () => {
        console.log(`🚀 GraphQL ready at http://localhost:${port}/graphql`);
    });
}

start().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
