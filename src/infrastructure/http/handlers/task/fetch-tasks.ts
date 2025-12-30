import { createFetchTasksHandler } from "@infrastructure/http/factories/task/fetch-tasks"
import { fetchTasks } from "@infrastructure/dependencies"

export const handler = createFetchTasksHandler(fetchTasks)
