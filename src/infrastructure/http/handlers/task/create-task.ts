import { CreateTaskUseCase } from "@app/ports/use-cases/task/create-task"
import { CreateTask } from "@app/use-cases/task/create-task"
import { createCreateTaskHandler } from "@infra/http/factories/task/create-task"
import { taskRepository } from "@infra/repositories/task-repository"
import { projectDetailsService } from "@infra/services/project-details-service"

export const createTask: CreateTaskUseCase = new CreateTask(projectDetailsService, taskRepository)

export const handler = createCreateTaskHandler(createTask)
