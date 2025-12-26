import { Context } from "../../../prisma";

export const Query = {
    articles: async (_: unknown, args: { limit?: number; cursor?: string | null }, ctx: Context) => {
        const limitRaw = args.limit ?? 10;
        const limit = Math.min(Math.max(limitRaw, 1), 50); // limit only from 1 to 50
        const cursor = args.cursor ?? null;

        const items = await ctx.prisma.sportsArticle.findMany({
            where: { deletedAt: null },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: limit + 1, // fetch one extra to compute nextCursor
            ...(cursor
                ? {
                    cursor: { id: cursor },
                }
                : {}),
        });

        let nextCursor: string | null = null;

        if (items.length > limit) {
            const extraItem = items.pop();
            nextCursor = extraItem?.id ?? null;
        }

        return {
            items,
            nextCursor,
        };
    },

    article: async (_: unknown, args: { id: string }, ctx: Context) => {
        const article = await ctx.prisma.sportsArticle.findFirst({
            where: { id: args.id, deletedAt: null },
        });

        return article;
    },

}