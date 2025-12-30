import { createFetchTasksHandler } from "@infra/http/factories/task/fetch-tasks"
import { fetchTasks } from "@infra/dependencies"

export const handler = createFetchTasksHandler(fetchTasks)
