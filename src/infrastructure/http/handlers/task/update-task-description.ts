import { createUpdateTaskDescriptionHandler } from "@infra/http/factories/task/update-task-description"
import { updateTaskDescription } from "@infra/dependencies"

export const handler = createUpdateTaskDescriptionHandler(updateTaskDescription)
