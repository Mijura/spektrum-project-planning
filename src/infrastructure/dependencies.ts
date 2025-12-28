import { CreateProject } from "@application/ports/inbound/project/create-project"
import { PlanTasksWithAI } from "@application/ports/inbound/project/plan-tasks-with-ai"
import { UpdateProjectDetails } from "@application/ports/inbound/project/update-details"
import { FetchProject } from "@application/ports/inbound/project/fetch-project"
import { FetchProjects } from "@application/ports/inbound/project/fetch-projects"
import { ArchiveProject } from "@application/ports/inbound/project/archive-project"

import { FetchProjectsUseCase } from "@application/use-cases/project/fetch-projects"
import { FetchProjectUseCase } from "@application/use-cases/project/fetch-project"
import { CreateProjectUseCase } from "@application/use-cases/project/create-project"
import { UpdateProjectDetailsUseCase } from "@application/use-cases/project/update-details"
import { ArchiveProjectUseCase } from "@application/use-cases/project/archive-project"


import { DynamoDBProjectRepository } from "@infrastructure/storage/repositories/project-repository"
import { DynamoDBTaskRepository } from "@infrastructure/storage/repositories/task-repository"

import { CreateTask } from "@application/ports/inbound/task/create-task"
import { FetchTasks } from "@application/ports/inbound/task/fetch-tasks"
import { UpdateTaskTitle } from "@application/ports/inbound/task/update-title"
import { UpdateTaskDescription } from "@application/ports/inbound/task/update-description"
import { CreateTaskUseCase } from "@application/use-cases/task/create-task"
import { FetchTasksUseCase } from "@application/use-cases/task/fetch-tasks"
import { UpdateTaskDescriptionUseCase } from "@application/use-cases/task/update-description"
import { UpdateTaskTitleUseCase } from "@application/use-cases/task/update-title"

import { PlanTasksWithAIUseCase } from "@application/use-cases/project/plan-tasks-with-ai"
import { MarketingService } from "@application/ports/inbound/marketing-service"

import { ProjectRepository } from "@application/ports/outbound/project-repository"
import { TaskRepository } from "@application/ports/outbound/task-repository"
import { DefaultMarketingService } from "@application/services/marketing-service"
import { ProductOwner } from "@infrastructure/ai/openai/product-owner"
import { Marketeer } from "@infrastructure/ai/openai/marketeer"
import { AICodingClient } from "@jigjoy-io/ai-coding-client"
import { ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { Agent } from "@domain/agent"


// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const taskRepository: TaskRepository = new DynamoDBTaskRepository()


// Agents
export const productOwner: Agent = new ProductOwner()
export const marketeer: Agent = new Marketeer()


export const marketingService: MarketingService = new DefaultMarketingService(marketeer, projectRepository)

const aiCodingEndpoint = process.env.AI_CODING_ENDPOINT || ''
const aiCodingClient = new AICodingClient(aiCodingEndpoint)

const projectDeploymentEndpoint = process.env.PROJECT_DEPLOYMENT_ENDPOINT || ''

const projectDeploymentClient = new ProjectDeploymentClient(projectDeploymentEndpoint)

// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(projectRepository, aiCodingClient, projectDeploymentClient)
export const planTasksWithAI: PlanTasksWithAI = new PlanTasksWithAIUseCase(productOwner, marketingService, taskRepository)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createTask: CreateTask = new CreateTaskUseCase(taskRepository, marketingService)
export const fetchTasks: FetchTasks = new FetchTasksUseCase(taskRepository)
export const updateTaskTitle: UpdateTaskTitle = new UpdateTaskTitleUseCase(taskRepository)
export const updateTaskDescription: UpdateTaskDescription = new UpdateTaskDescriptionUseCase(taskRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
