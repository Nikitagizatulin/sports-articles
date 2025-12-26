import { prisma } from '../prisma';

async function main() {
    const existing = await prisma.sportsArticle.count();
    if (existing > 0) {
        console.log(`Seed skipped (already has ${existing} articles).`);
        return;
    }

    const data = Array.from({ length: 15 }).map((_, i) => ({
        title: `Sports Article #${i + 1}`,
        content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: i % 3 === 0 ? "https://picsum.photos/seed/sports/800/400" : null,
    }));

    await prisma.sportsArticle.createMany({ data });
    console.log("Seeded 15 articles.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
