# Sports Articles Application

A full-stack test application for managing sports articles, built with Next.js, GraphQL, Apollo Server, Prisma, and PostgreSQL.

## 🏗️ Project Structure

This is a monorepo using pnpm workspaces with the following structure:

```
test-assessment/
├── apps/
│   ├── backend/          # GraphQL API server (Express + Apollo Server)
│   └── frontend/         # Next.js web application
├── docker-compose.yml    # PostgreSQL database configuration
├── package.json          # Root package.json with workspace scripts
└── pnpm-workspace.yaml   # pnpm workspace configuration
```

## 📋 Prerequisites

- **Node.js** 18+ 
- **pnpm** 9.0.0+ (specified in package.json)
- **Docker** and **Docker Compose** (for PostgreSQL database)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start the Database

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port 5432 with the following credentials:
- Database: `sports_articles`
- User: `root`
- Password: `password`

### 3. Configure Environment Variables

**Important:** You must configure environment variables before running migrations and seeding the database.

#### Backend Environment Variables

Create a `.env` file in `apps/backend/` by copying the example file:

```bash
cd apps/backend
cp .env.example .env
```

The `.env.example` file contains:

```env
# Postgres
DATABASE_URL="postgresql://root:password@localhost:5432/sports_articles?schema=public"

# Server
PORT=4000
NODE_ENV=development
```

Update the `DATABASE_URL` if your database credentials differ from the defaults.

#### Frontend Environment Variables

Create a `.env.local` file in `apps/frontend/` by copying the example file:

```bash
cd apps/frontend
cp .env.example .env.local
```

The `.env.example` file contains:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

Update the URL if your backend is running on a different port or host.

### 4. Set Up Backend

```bash
cd apps/backend

# Generate Prisma Client
pnpm prisma:generate

# Run database migrations (requires DATABASE_URL in .env)
pnpm prisma:migrate

# Seed the database (optional - creates 15 sample articles)
pnpm prisma:seed
```

### 5. Start Development Servers

From the root directory:

```bash
# Start both backend and frontend
pnpm dev

# Or start them separately:
pnpm dev:backend   # Backend on http://localhost:4000/graphql
pnpm dev:frontend  # Frontend on http://localhost:3000
```

## 🛠️ Available Scripts

### Root Level

- `pnpm dev` - Start both backend and frontend in development mode
- `pnpm dev:backend` - Start only the backend server
- `pnpm dev:frontend` - Start only the frontend server
- `pnpm lint` - Run ESLint across all apps
- `pnpm format` - Format code with Prettier across all apps

### Backend (`apps/backend`)

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm prisma:generate` - Generate Prisma Client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:seed` - Seed the database
- `pnpm prisma:studio` - Open Prisma Studio (database GUI)

### Frontend (`apps/frontend`)

- `pnpm dev` - Start Next.js development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## 📚 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Apollo Server** - GraphQL server
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database
- **TypeScript** - Type safety

### Frontend
- **Next.js** 16 - React framework
- **React** 19 - UI library
- **Apollo Client** - GraphQL client
- **Ant Design** - UI component library
- **TypeScript** - Type safety

## 📖 API Documentation

### GraphQL Schema

The GraphQL API provides the following operations:

#### Queries

- `articles(limit: Int, cursor: ID)` - Get paginated list of articles
- `article(id: ID!)` - Get a single article by ID

#### Mutations

- `createArticle(input: ArticleInput!)` - Create a new article
- `updateArticle(id: ID!, input: ArticleInput!)` - Update an existing article
- `deleteArticle(id: ID!)` - Delete an article (soft delete)

### GraphQL Playground

Once the backend is running, you can access the GraphQL Playground at:
```
http://localhost:4000/graphql
```

## 🗄️ Database Schema

The application uses a `SportsArticle` model with the following fields:

- `id` (String, UUID) - Primary key
- `title` (String) - Article title
- `content` (String) - Article content
- `imageUrl` (String, optional) - Image URL
- `createdAt` (DateTime) - Creation timestamp
- `deletedAt` (DateTime, optional) - Soft delete timestamp

## 🎨 Code Quality

This project follows best practices for code quality and maintainability:

### ESLint
- **Backend**: Configured with TypeScript ESLint rules
- **Frontend**: Configured with Next.js ESLint config

### Prettier
- Consistent code formatting across the entire project
- Configuration in `.prettierrc.json`
- Ignore patterns in `.prettierignore`

### EditorConfig
- Consistent editor settings (indentation, line endings, etc.)
- Configuration in `.editorconfig`

### Running Linters and Formatters

```bash
# Run linting
pnpm lint

# Fix linting issues automatically
cd apps/backend && pnpm lint:fix
cd apps/frontend && pnpm lint:fix

# Format code
pnpm format

# Check formatting without changing files
cd apps/backend && pnpm format:check
cd apps/frontend && pnpm format:check
```

## 🔧 Configuration

### Environment Variables

Environment variables are required for both backend and frontend applications. Example files (`.env.example`) are provided in each app directory.

#### Backend (`apps/backend/.env`)

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment mode (default: development)

Copy `.env.example` to `.env` and update the values as needed:

```bash
cd apps/backend
cp .env.example .env
```

#### Frontend (`apps/frontend/.env.local`)

Required variables:
- `NEXT_PUBLIC_GRAPHQL_URL` - GraphQL API endpoint URL

Copy `.env.example` to `.env.local` and update the URL if needed:

```bash
cd apps/frontend
cp .env.example .env.local
```

**Note:** In Next.js, environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Other variables are only available on the server side.

### Prisma Configuration

Prisma schema is located at `apps/backend/prisma/schema.prisma`. 

After making changes to the schema:
1. Create a migration: `pnpm prisma:migrate`
2. Generate Prisma Client: `pnpm prisma:generate`

## 🧪 Testing

(Note: Test setup can be added as needed)

## 📝 Development Guidelines

1. **Code Style**: Use ESLint and Prettier to maintain consistent code style
2. **Type Safety**: Leverage TypeScript for type safety across the stack
3. **Git Workflow**: Follow conventional commit messages
4. **Code Reviews**: All changes should be reviewed before merging

## 🐛 Troubleshooting

### Database Connection Issues

- Ensure Docker is running and the database container is up: `docker-compose ps`
- Verify that `apps/backend/.env` file exists and contains the correct `DATABASE_URL`
- Check that the database credentials match your docker-compose.yml configuration
- Verify PostgreSQL is accessible on port 5432

### Environment Variable Issues

- **Backend**: Ensure `apps/backend/.env` exists and contains `DATABASE_URL` before running migrations
- **Frontend**: Ensure `apps/frontend/.env.local` exists and contains `NEXT_PUBLIC_GRAPHQL_URL`
- If the frontend cannot connect to the backend, verify the GraphQL URL in `.env.local` matches your backend server URL

### Port Conflicts

- Backend default port: 4000 (configurable via `PORT` env variable)
- Frontend default port: 3000 (configurable via Next.js config)
- Database default port: 5432

### Prisma Issues

- Run `pnpm prisma:generate` after schema changes
- Reset database if needed: `pnpm prisma:migrate reset`

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

(Add contribution guidelines as needed)

