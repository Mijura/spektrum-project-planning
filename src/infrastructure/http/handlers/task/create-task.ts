import { createCreateTaskHandler } from "@infra/http/factories/task/create-task"
import { createTask } from "@infra/dependencies"

export const handler = createCreateTaskHandler(createTask)
