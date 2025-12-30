import { createUpdateTaskTitleHandler } from "@infrastructure/http/factories/task/update-task-title"
import { updateTaskTitle } from "@infrastructure/dependencies"

export const handler = createUpdateTaskTitleHandler(updateTaskTitle)
