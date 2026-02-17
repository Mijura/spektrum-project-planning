import { createUpdateTaskDescriptionHandler } from "@infra/http/factories/task/update-task-description"
import { UpdateTaskDescription } from "@app/use-cases/task/update-description"
import { UpdateTaskDescriptionUseCase } from "@app/ports/use-cases/task/update-description"
import { taskRepository } from "@infra/repositories/task-repository"

export const updateTaskDescription: UpdateTaskDescriptionUseCase = new UpdateTaskDescription(taskRepository)
export const handler = createUpdateTaskDescriptionHandler(updateTaskDescription)
