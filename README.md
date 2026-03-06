# Project Planning

Project Planning is a project and task management service for the JigJoy AI coding platform. It translates user intent into actionable development plans, coordinates AI-powered task generation, and tracks execution across agents.

## Architecture

Serverless microservice built with AWS SAM using Clean Architecture (Hexagonal / Ports & Adapters) and Domain-Driven Design.

**AWS Resources:**
- 12 Lambda functions (Node.js 22.x, esbuild-bundled)
- 2 DynamoDB tables (`${StackName}-Project`, `${StackName}-Task`)
- IAM roles with `DynamoDBCrudPolicy` per function
- Secrets Manager references for API keys (JigJoyApiEndpoint, OpenAIAPIKey, AnthropicAPIKey)

**Lambda Functions:**

| Function | Description | Tables |
|----------|-------------|--------|
| CreateProject | Create a new project with AI initialization & cloud deployment | Project |
| UpdateProjectDetails | Update project name/description | Project |
| FetchProject | Retrieve a single project by ID | Project |
| FetchProjects | List all projects for an owner | Project |
| ArchiveProject | Soft-delete a project | Project |
| PlanTasks | AI-powered task breakdown from project description | Project, Task |
| CreateTask | Create a new task for a project | Project, Task |
| UpdateTaskTitle | Update a task's title | Task |
| UpdateTaskDescription | Update a task's description | Task |
| FetchTasks | Get all tasks for a project | Task |
| LeaveComment | Add a comment to a task (activity log) | Task |
| RecordWork | Track work started/finished on a task | Task |

All function ARNs are exported via CloudFormation outputs for use by `platform-serverless-api`.

### Domain Model

**Project Aggregate**: `id`, `ownerId`, `name`, `description`, `status` (Active/Archived), timestamps. Supports creation, detail updates, and archiving.

**Task Aggregate**: `id`, `projectId`, `title`, `description`, `status`, activity log. Tasks track all changes via an event-sourcing pattern with activity types: `TaskCreated`, `TitleUpdated`, `DescriptionUpdated`, `CommentLeft`, `StartedWork`, `FinishedWork`.

### Layers

```
Infrastructure (Adapters)
  - HTTP handlers & factories
  - DynamoDB repositories
  - Mosaic AI generators (task planning, project details)
  - JigJoy SDK services (AI coding, deployment)
         |
Application (Use Cases & Ports)
  - Use case orchestrators
  - Port interfaces (dependency inversion)
  - In-memory mocks for testing
         |
Domain (Business Logic)
  - Project & Task aggregates
  - Activity event log
  - Value objects & enums
```

## Prerequisites

- Node.js 22.x
- AWS SAM CLI
- AWS CLI configured with `spektrum-dev` profile

## Setup

```bash
npm install
```

### GitHub Packages

This project depends on `@jigjoy-ai/platform-sdk`, `@jigjoy-ai/serverless-core`, and `@jigjoy-ai/task-contracts` from GitHub Packages. You need a `.npmrc` file in the project root:

```
@jigjoy-ai:registry=https://npm.pkg.github.com
```

Your global `~/.npmrc` must have a GitHub PAT with `read:packages` scope:

```
//npm.pkg.github.com/:_authToken=<your-github-pat>
```

### Environment Variables for Tests

Create a `.env.test` file in the project root (gitignored):

```
AWS_REGION="eu-west-1"
PROJECT_TABLE="spektrum-project-planning-Project"
TASK_TABLE="spektrum-project-planning-Task"
```

### Secrets Manager

The following keys must exist in the `vars` Secrets Manager secret:

| Key | Description |
|-----|-------------|
| `JigJoyApiEndpoint` | Base URL for the JigJoy platform API (platform-serverless-api) |
| `OpenAIAPIKey` | OpenAI API key for Mosaic AI generators |
| `AnthropicAPIKey` | Anthropic API key for AI operations |

## Running Tests

```bash
# Unit tests only (no AWS credentials needed)
npm test

# All tests including DynamoDB integration tests (requires AWS credentials + deployed stack)
AWS_PROFILE=spektrum-dev npm test
```

**Test breakdown:**
- **Domain tests**: Project/task aggregates, activity event log, validation rules
- **Application tests**: Use case orchestration with in-memory mocks
- **Infrastructure HTTP tests**: Handler request/response mapping, error handling
- **Infrastructure repository tests**: DynamoDB integration (requires deployed stack)
- **Infrastructure generator tests**: Mosaic AI integration (requires OpenAI API key)
- **Infrastructure service tests**: JigJoy API integration (requires valid JigJoyApiEndpoint)

## Build

```bash
npm run build:dev
```

## Deploy

**Stack name:** `spektrum-project-planning`
**Region:** `eu-west-1`
**Profile:** `spektrum-dev`

```bash
sam deploy --profile spektrum-dev --no-confirm-changeset --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```

Or using npm scripts:

```bash
npm run build:dev
npm run deploy:dev
```

## Local Development

```bash
# Build and serve locally on port 4000
npm run build:local
npm run serve:local

# API docs on port 4040
npm run docs
```

Local development requires an `env.json` file with Lambda environment variables (gitignored).

## API Endpoints

### Project

| Method | Path | Description |
|--------|------|-------------|
| POST | `/project` | Create a new project |
| GET | `/project/fetch/{projectId}` | Fetch a project by ID |
| GET | `/project/fetch-all/{ownerId}` | Fetch all projects for an owner |
| PUT | `/project` | Update project details |
| PUT | `/project/archive` | Archive a project |
| POST | `/project/plan-tasks` | AI-powered task planning |

### Task

| Method | Path | Description |
|--------|------|-------------|
| POST | `/task` | Create a new task |
| GET | `/task/fetch-all/{projectId}` | Fetch all tasks for a project |
| PUT | `/task/title` | Update task title |
| PUT | `/task/description` | Update task description |
| POST | `/task/leave-comment` | Leave a comment on a task |
| POST | `/task/record-work` | Record work on a task |
