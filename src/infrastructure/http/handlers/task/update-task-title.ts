import { UpdateTaskTitleUseCase } from "@app/ports/use-cases/task/update-title"
import { UpdateTaskTitle } from "@app/use-cases/task/update-title"
import { createUpdateTaskTitleHandler } from "@infra/http/factories/task/update-task-title"
import { taskRepository } from "@infra/repositories/task-repository"

export const updateTaskTitle: UpdateTaskTitleUseCase = new UpdateTaskTitle(taskRepository)

export const handler = createUpdateTaskTitleHandler(updateTaskTitle)
