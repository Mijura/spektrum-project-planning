import { CreateProjectPort } from "@app/ports/use-cases/project/create-project"
import { PlanTasksPort } from "@app/ports/use-cases/task/plan-tasks"
import { UpdateProjectDetailsPort } from "@app/ports/use-cases/project/update-details"
import { FetchProjectPort } from "@app/ports/use-cases/project/fetch-project"
import { FetchProjectsPort } from "@app/ports/use-cases/project/fetch-projects"
import { ArchiveProjectPort } from "@app/ports/use-cases/project/archive-project"

import { FetchProjectsUseCase } from "@app/use-cases/project/fetch-projects"
import { FetchProjectUseCase } from "@app/use-cases/project/fetch-project"
import { CreateProjectUseCase } from "@app/use-cases/project/create-project"
import { UpdateProjectDetailsUseCase } from "@app/use-cases/project/update-details"
import { ArchiveProjectUseCase } from "@app/use-cases/project/archive-project"

import { DynamoDBProjectRepository } from "@infra/repositories/project-repository"
import { DynamoDBTaskRepository } from "@infra/repositories/task-repository"

import { CreateTaskPort } from "@app/ports/use-cases/task/create-task"
import { FetchTasksPort } from "@app/ports/use-cases/task/fetch-tasks"
import { UpdateTaskTitlePort } from "@app/ports/use-cases/task/update-title"
import { UpdateTaskDescriptionPort } from "@app/ports/use-cases/task/update-description"
import { CreateTaskUseCase } from "@app/use-cases/task/create-task"
import { FetchTasksUseCase } from "@app/use-cases/task/fetch-tasks"
import { UpdateTaskDescriptionUseCase } from "@app/use-cases/task/update-description"
import { UpdateTaskTitleUseCase } from "@app/use-cases/task/update-title"
import { PlanTasksUseCase } from "@app/use-cases/task/plan-tasks"

import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { AIAssistantService } from "@infra/services/ai-asisstant-service"
import { AICodingClient } from "@jigjoy-io/ai-coding-client"
import { ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { AIAssistantServicePort } from "@app/ports/services/ai-asisstant-service"
import { LeaveCommentUseCase } from "@app/use-cases/task/leave-comment"
import { LeaveCommentPort } from "@app/ports/use-cases/task/leave-comment"

// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const taskRepository: TaskRepository = new DynamoDBTaskRepository()

// Services
const aiAssistantService: AIAssistantServicePort = new AIAssistantService(projectRepository, taskRepository)

// SDK Clients
const aiCodingEndpoint = process.env.AI_CODING_ENDPOINT || ""
const aiCodingClient = new AICodingClient(aiCodingEndpoint)
const projectDeploymentEndpoint = process.env.PROJECT_DEPLOYMENT_ENDPOINT || ""
const projectDeploymentClient = new ProjectDeploymentClient(projectDeploymentEndpoint)

// Use Cases
export const createNewProject: CreateProjectPort = new CreateProjectUseCase(
	projectRepository,
	aiCodingClient,
	projectDeploymentClient,
)
export const planTasks: PlanTasksPort = new PlanTasksUseCase(aiAssistantService)
export const fetchProject: FetchProjectPort = new FetchProjectUseCase(projectRepository)
export const fetchProjects: FetchProjectsPort = new FetchProjectsUseCase(projectRepository)
export const archiveProject: ArchiveProjectPort = new ArchiveProjectUseCase(projectRepository)
export const createTask: CreateTaskPort = new CreateTaskUseCase(aiAssistantService, taskRepository)
export const fetchTasks: FetchTasksPort = new FetchTasksUseCase(taskRepository)
export const updateTaskTitle: UpdateTaskTitlePort = new UpdateTaskTitleUseCase(taskRepository)
export const updateTaskDescription: UpdateTaskDescriptionPort = new UpdateTaskDescriptionUseCase(taskRepository)
export const updateProjectDetails: UpdateProjectDetailsPort = new UpdateProjectDetailsUseCase(projectRepository)
export const leaveComment: LeaveCommentPort = new LeaveCommentUseCase(taskRepository)
