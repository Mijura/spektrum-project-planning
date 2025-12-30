import { createUpdateTaskTitleHandler } from "@infra/http/factories/task/update-task-title"
import { updateTaskTitle } from "@infra/dependencies"

export const handler = createUpdateTaskTitleHandler(updateTaskTitle)
