import { createUpdateTaskDescriptionHandler } from "@infrastructure/http/factories/task/update-task-description"
import { updateTaskDescription } from "@infrastructure/dependencies"

export const handler = createUpdateTaskDescriptionHandler(updateTaskDescription)
