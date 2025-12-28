import { CreateProjectPort } from "@application/ports/use-cases/project/create-project"
import { PlanTasksPort } from "@application/ports/use-cases/task/plan-tasks"
import { UpdateProjectDetailsPort } from "@application/ports/use-cases/project/update-details"
import { FetchProjectPort } from "@application/ports/use-cases/project/fetch-project"
import { FetchProjectsPort } from "@application/ports/use-cases/project/fetch-projects"
import { ArchiveProjectPort } from "@application/ports/use-cases/project/archive-project"

import { FetchProjectsUseCase } from "@application/use-cases/project/fetch-projects"
import { FetchProjectUseCase } from "@application/use-cases/project/fetch-project"
import { CreateProjectUseCase } from "@application/use-cases/project/create-project"
import { UpdateProjectDetailsUseCase } from "@application/use-cases/project/update-details"
import { ArchiveProjectUseCase } from "@application/use-cases/project/archive-project"


import { DynamoDBProjectRepository } from "@infrastructure/repositories/project-repository"
import { DynamoDBTaskRepository } from "@infrastructure/repositories/task-repository"

import { CreateTaskPort } from "@application/ports/use-cases/task/create-task"
import { FetchTasksPort } from "@application/ports/use-cases/task/fetch-tasks"
import { UpdateTaskTitlePort } from "@application/ports/use-cases/task/update-title"
import { UpdateTaskDescriptionPort } from "@application/ports/use-cases/task/update-description"
import { CreateTaskUseCase } from "@application/use-cases/task/create-task"
import { FetchTasksUseCase } from "@application/use-cases/task/fetch-tasks"
import { UpdateTaskDescriptionUseCase } from "@application/use-cases/task/update-description"
import { UpdateTaskTitleUseCase } from "@application/use-cases/task/update-title"
import { PlanTasksUseCase } from "@application/use-cases/task/plan-tasks"

import { ProjectRepository } from "@application/ports/repositories/project-repository"
import { TaskRepository } from "@application/ports/repositories/task-repository"
import { AIAssistantService } from "@application/services/ai-asisstant-service"
import { TaskPlanner } from "@infrastructure/agents/task-planner"
import { ProjectDetailsGenerator } from "@infrastructure/agents/project-details-generator"
import { AICodingClient } from "@jigjoy-io/ai-coding-client"
import { ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { TaskPlannerPort } from "@application/services/agents/task-planner"
import { AIAssistantServicePort } from "@application/ports/services/ai-asisstant-service"
import { ProjectDetailsGeneratorPort } from "@application/services/agents/project-details-generator"


// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const taskRepository: TaskRepository = new DynamoDBTaskRepository()


// Agents
const taskPlanner: TaskPlannerPort = new TaskPlanner()
const projectDetailsGenerator: ProjectDetailsGeneratorPort = new ProjectDetailsGenerator()


const aiAssistantService: AIAssistantServicePort = new AIAssistantService(projectDetailsGenerator, taskPlanner, projectRepository, taskRepository)

const aiCodingEndpoint = process.env.AI_CODING_ENDPOINT || ''
const aiCodingClient = new AICodingClient(aiCodingEndpoint)

const projectDeploymentEndpoint = process.env.PROJECT_DEPLOYMENT_ENDPOINT || ''

const projectDeploymentClient = new ProjectDeploymentClient(projectDeploymentEndpoint)

// Use Cases
export const createNewProject: CreateProjectPort = new CreateProjectUseCase(projectRepository, aiCodingClient, projectDeploymentClient)
export const planTasksWithAI: PlanTasksPort = new PlanTasksUseCase(aiAssistantService)
export const fetchProject: FetchProjectPort = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjectsPort = new FetchProjectsUseCase(projectRepository)
export const archiveProject: ArchiveProjectPort = new ArchiveProjectUseCase(projectRepository)
export const createTask: CreateTaskPort = new CreateTaskUseCase(aiAssistantService, taskRepository)
export const fetchTasks: FetchTasksPort = new FetchTasksUseCase(taskRepository)
export const updateTaskTitle: UpdateTaskTitlePort = new UpdateTaskTitleUseCase(taskRepository)
export const updateTaskDescription: UpdateTaskDescriptionPort = new UpdateTaskDescriptionUseCase(taskRepository)
export const updateProjectDetails: UpdateProjectDetailsPort = new UpdateProjectDetailsUseCase(projectRepository)
