import { FetchTasksUseCase } from "@app/ports/use-cases/task/fetch-tasks"
import { FetchTasks } from "@app/use-cases/task/fetch-tasks"
import { createFetchTasksHandler } from "@infra/http/factories/task/fetch-tasks"
import { taskRepository } from "@infra/repositories/task-repository"

export const fetchTasks: FetchTasksUseCase = new FetchTasks(taskRepository)

export const handler = createFetchTasksHandler(fetchTasks)
