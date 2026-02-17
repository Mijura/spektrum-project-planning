import { FetchProjects } from "@app/use-cases/project/fetch-projects"
import { FetchProject } from "@app/use-cases/project/fetch-project"
import { UpdateProjectDetails } from "@app/use-cases/project/update-details"
import { ArchiveProject } from "@app/use-cases/project/archive-project"
import { DynamoDBProjectRepository } from "@infra/repositories/project-repository"
import { DynamoDBTaskRepository } from "@infra/repositories/task-repository"
import { CreateTask } from "@app/use-cases/task/create-task"
import { FetchTasks } from "@app/use-cases/task/fetch-tasks"
import { UpdateTaskDescription } from "@app/use-cases/task/update-description"
import { UpdateTaskTitle } from "@app/use-cases/task/update-title"
import { PlanTasks } from "@app/use-cases/task/plan-tasks"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { LeaveComment } from "@app/use-cases/task/leave-comment"
import { RecordWork } from "@app/use-cases/task/record-work"
import { CreateProject } from "@app/use-cases/project/create-project"
import { CreateProjectUseCase } from "@app/ports/use-cases/project/create-project"
import { PlanTasksUseCase } from "@app/ports/use-cases/task/plan-tasks"
import { FetchProjectUseCase } from "@app/ports/use-cases/project/fetch-project"
import { FetchProjectsUseCase } from "@app/ports/use-cases/project/fetch-projects"
import { ArchiveProjectUseCase } from "@app/ports/use-cases/project/archive-project"
import { CreateTaskUseCase } from "@app/ports/use-cases/task/create-task"
import { FetchTasksUseCase } from "@app/ports/use-cases/task/fetch-tasks"
import { UpdateTaskTitleUseCase } from "@app/ports/use-cases/task/update-title"
import { UpdateTaskDescriptionUseCase } from "@app/ports/use-cases/task/update-description"
import { UpdateProjectDetailsUseCase } from "@app/ports/use-cases/project/update-details"
import { LeaveCommentUseCase } from "@app/ports/use-cases/task/leave-comment"
import { RecordWorkUseCase } from "@app/ports/use-cases/task/record-work"
import { ProjectDetailsService } from "@app/services/project-details-service"
import { ProjectDetailsGenerator } from "@app/ports/generators/project-details-generator"
import { TaskGenerator } from "@app/ports/generators/task-generator"
import { MosaicProjectDetailsGenerator } from "./generators/project-details-generator"
import { MosaicTaskGenerator } from "@infra/generators/task-generator"
import { AICodingService } from "@app/ports/services/ai-coding-service"
import { JigJoyAICodingService } from "@infra/services/ai-coding-service"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { JigJoyProjectDeploymentService } from "./services/project-deployment-service"

// Repositories
export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
export const taskRepository: TaskRepository = new DynamoDBTaskRepository()

// Generators
const projectDetailsGenerator: ProjectDetailsGenerator = new MosaicProjectDetailsGenerator()
const taskGenerator: TaskGenerator = new MosaicTaskGenerator()

// Services
const projectDetailsService: ProjectDetailsService = new ProjectDetailsService(
	projectRepository,
	projectDetailsGenerator,
)
const aiCodingService: AICodingService = new JigJoyAICodingService()
const projectDeploymentService: ProjectDeploymentService = new JigJoyProjectDeploymentService()

// Use Cases
export const createNewProject: CreateProjectUseCase = new CreateProject(
	projectRepository,
	aiCodingService,
	projectDeploymentService,
)
export const planTasks: PlanTasksUseCase = new PlanTasks(projectDetailsService, taskRepository, taskGenerator)
export const fetchProject: FetchProjectUseCase = new FetchProject(projectRepository)
export const fetchProjects: FetchProjectsUseCase = new FetchProjects(projectRepository)
export const archiveProject: ArchiveProjectUseCase = new ArchiveProject(projectRepository)
export const createTask: CreateTaskUseCase = new CreateTask(projectDetailsService, taskRepository)
export const fetchTasks: FetchTasksUseCase = new FetchTasks(taskRepository)
export const updateTaskTitle: UpdateTaskTitleUseCase = new UpdateTaskTitle(taskRepository)
export const updateTaskDescription: UpdateTaskDescriptionUseCase = new UpdateTaskDescription(taskRepository)
export const updateProjectDetails: UpdateProjectDetailsUseCase = new UpdateProjectDetails(projectRepository)
export const leaveComment: LeaveCommentUseCase = new LeaveComment(taskRepository)
export const recordWork: RecordWorkUseCase = new RecordWork(taskRepository)
