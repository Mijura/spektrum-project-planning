import { CreateProject } from "@domain/use-cases/project/create-project"
import { PlanTasksWithAI } from "@domain/use-cases/project/plan-tasks-with-ai"
import { UpdateProjectDetails } from "@domain/use-cases/project/update-details"
import { FetchProject } from "@domain/use-cases/project/fetch-project"
import { FetchProjects } from "@domain/use-cases/project/fetch-projects"
import { ArchiveProject } from "@domain/use-cases/project/archive-project"

import { FetchProjectsUseCase } from "@application/use-cases/project/fetch-projects"
import { FetchProjectUseCase } from "@application/use-cases/project/fetch-project"
import { CreateProjectUseCase } from "@application/use-cases/project/create-project"
import { UpdateProjectDetailsUseCase } from "@application/use-cases/project/update-details"
import { ArchiveProjectUseCase } from "@application/use-cases/project/archive-project"


import { DynamoDBProjectRepository } from "@infrastructure/adapters/repositories/project-repository"
import { DynamoDBTaskRepository } from "@infrastructure/adapters/repositories/task-repository"

import { CreateTask } from "@domain/use-cases/task/create-task"
import { FetchTasks } from "@domain/use-cases/task/fetch-tasks"
import { UpdateTaskTitle } from "@domain/use-cases/task/update-title"
import { UpdateTaskDescription } from "@domain/use-cases/task/update-description"
import { CreateTaskUseCase } from "@application/use-cases/task/create-task"
import { FetchTasksUseCase } from "@application/use-cases/task/fetch-tasks"
import { UpdateTaskDescriptionUseCase } from "@application/use-cases/task/update-description"
import { UpdateTaskTitleUseCase } from "@application/use-cases/task/update-title"

import { PlanTasksWithAIUseCase } from "@application/use-cases/project/plan-tasks-with-ai"
import { MarketingService } from "@domain/ports/services/marketing-service"

import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { TaskRepository } from "@domain/ports/repositories/task-repository"
import { DefaultMarketingService } from "@application/services/marketing-service"
import { ProductOwner } from "@infrastructure/adapters/ai/openai/product-owner"
import { Marketeer } from "@infrastructure/adapters/ai/openai/marketeer"
import { Agent } from "@domain/agent"


// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const taskRepository: TaskRepository = new DynamoDBTaskRepository()


// Agents
export const productOwner: Agent = new ProductOwner()
export const marketeer: Agent = new Marketeer()


export const marketingService: MarketingService = new DefaultMarketingService(marketeer, projectRepository)

// Use Cases
export const createNewProject: CreateProject = new CreateProjectUseCase(projectRepository)
export const planTasksWithAI: PlanTasksWithAI = new PlanTasksWithAIUseCase(productOwner, marketingService, taskRepository)
export const fetchProject: FetchProject = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjects = new FetchProjectsUseCase(projectRepository)
export const archiveProject: ArchiveProject = new ArchiveProjectUseCase(projectRepository)
export const createTask: CreateTask = new CreateTaskUseCase(taskRepository, marketingService)
export const fetchTasks: FetchTasks = new FetchTasksUseCase(taskRepository)
export const updateTaskTitle: UpdateTaskTitle = new UpdateTaskTitleUseCase(taskRepository)
export const updateTaskDescription: UpdateTaskDescription = new UpdateTaskDescriptionUseCase(taskRepository)
export const updateProjectDetails: UpdateProjectDetails = new UpdateProjectDetailsUseCase(projectRepository)
