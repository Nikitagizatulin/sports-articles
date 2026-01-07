import { prisma, Context } from "../../../prisma";
import { GraphQLError } from "graphql";
import { validateArticleInput } from "../../utils/validation";

function notFound(message: string): never {
    throw new GraphQLError(message, {
        extensions: { code: "NOT_FOUND" },
    });
}
export const Mutation = {
    createArticle: async (_: unknown, args: { input: { title: string; content: string; imageUrl?: string | null } }, ctx: Context) => {
        try {
            const { title, content, imageUrl } = validateArticleInput(args.input);

            const created = await ctx.prisma.sportsArticle.create({
                data: {
                    title,
                    content,
                    imageUrl,
                },
            });

            return created;
        } catch (error) {
            // Re-throw GraphQLErrors (validation errors) as-is
            if (error instanceof GraphQLError) throw error;
            // Wrap other errors
            throw new GraphQLError("Failed to create article", {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
    },

    updateArticle: async (_: unknown, args: { id: string; input: { title: string; content: string; imageUrl?: string | null } }, ctx: Context) => {
        try {
            const { title, content, imageUrl } = validateArticleInput(args.input);

            const exists = await ctx.prisma.sportsArticle.findFirst({
                where: { id: args.id, deletedAt: null },
                select: { id: true },
            });
            if (!exists) notFound("Article not found.");

            return await ctx.prisma.sportsArticle.update({
                where: { id: args.id },
                data: {
                    title,
                    content,
                    imageUrl,
                },
            });
        } catch (error) {
            // Re-throw GraphQLErrors (validation errors) as-is
            if (error instanceof GraphQLError) throw error;
            // Wrap other errors
            throw new GraphQLError("Failed to update article", {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
    },

    deleteArticle: async (_: unknown, args: { id: string }, ctx: Context) => {
        try {
            const exists = await ctx.prisma.sportsArticle.findFirst({
                where: { id: args.id, deletedAt: null },
                select: { id: true },
            });
            if (!exists) notFound("Article not found.");

            await ctx.prisma.sportsArticle.update({
                where: { id: args.id },
                data: { deletedAt: new Date() },
            });

            return true;
        } catch (error) {
            // Re-throw GraphQLErrors (validation errors) as-is
            if (error instanceof GraphQLError) throw error;
            // Wrap other errors
            throw new GraphQLError("Failed to delete article", {
                extensions: { code: "INTERNAL_SERVER_ERROR" },
            });
        }
    },
};