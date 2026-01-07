import { GraphQLError } from "graphql";

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;
const MAX_IMAGE_URL_LENGTH = 2048;

export function validateUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

export function validateArticleInput(input: {
    title?: string;
    content?: string;
    imageUrl?: string | null;
}) {
    const title = (input.title ?? "").trim();
    const content = (input.content ?? "").trim();
    const imageUrl = input.imageUrl?.trim() || null;

    if (!title) {
        throw new GraphQLError("Title is required.", {
            extensions: { code: "BAD_USER_INPUT", field: "title" },
        });
    }

    if (title.length > MAX_TITLE_LENGTH) {
        throw new GraphQLError(`Title must be at most ${MAX_TITLE_LENGTH} characters.`, {
            extensions: { code: "BAD_USER_INPUT", field: "title" },
        });
    }

    if (!content) {
        throw new GraphQLError("Content is required.", {
            extensions: { code: "BAD_USER_INPUT", field: "content" },
        });
    }

    if (content.length > MAX_CONTENT_LENGTH) {
        throw new GraphQLError(`Content must be at most ${MAX_CONTENT_LENGTH} characters.`, {
            extensions: { code: "BAD_USER_INPUT", field: "content" },
        });
    }

    if (imageUrl) {
        if (imageUrl.length > MAX_IMAGE_URL_LENGTH) {
            throw new GraphQLError(`Image URL must be at most ${MAX_IMAGE_URL_LENGTH} characters.`, {
                extensions: { code: "BAD_USER_INPUT", field: "imageUrl" },
            });
        }

        if (!validateUrl(imageUrl)) {
            throw new GraphQLError("Image URL must be a valid HTTP or HTTPS URL.", {
                extensions: { code: "BAD_USER_INPUT", field: "imageUrl" },
            });
        }
    }

    return { title, content, imageUrl };
}

