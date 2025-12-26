import { prisma, Context } from "../../../prisma";
import { GraphQLError } from "graphql";

function badInput(message: string, field?: string): never {
    throw new GraphQLError(message, {
        extensions: {
            code: "BAD_USER_INPUT",
            field,
        },
    });
}
function notFound(message: string): never {
    throw new GraphQLError(message, {
        extensions: { code: "NOT_FOUND" },
    });
}

function validateArticleInput(input: { title?: string; content?: string }) {
    const title = (input.title ?? "").trim();
    const content = (input.content ?? "").trim();

    if (!title) badInput("Title is required.", "title");
    if (!content) badInput("Content is required.", "content");

    return { title, content };
}
export const Mutation = {
    createArticle: async (_: unknown, args: { input: { title: string; content: string; imageUrl?: string | null } }, ctx: Context) => {
        const { title, content } = validateArticleInput(args.input);

        const created = await ctx.prisma.sportsArticle.create({
            data: {
                title,
                content,
                imageUrl: args.input.imageUrl ?? null,
            },
        });

        return created;
    },

    updateArticle: async (_: unknown, args: { id: string; input: { title: string; content: string; imageUrl?: string | null } }, ctx: Context) => {
        const { title, content } = validateArticleInput(args.input);

        const exists = await ctx.prisma.sportsArticle.findFirst({
            where: { id: args.id, deletedAt: null },
            select: { id: true },
        });
        if (!exists) notFound("Article not found.");

        return ctx.prisma.sportsArticle.update({
            where: { id: args.id },
            data: {
                title,
                content,
                imageUrl: args.input.imageUrl ?? null,
            },
        });
    },

    deleteArticle: async (_: unknown, args: { id: string }, ctx: Context) => {
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
    },
};