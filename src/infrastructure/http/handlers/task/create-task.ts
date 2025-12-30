import { createCreateTaskHandler } from "@infrastructure/http/factories/task/create-task"
import { createTask } from "@infrastructure/dependencies"

export const handler = createCreateTaskHandler(createTask)
