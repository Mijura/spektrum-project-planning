import { createCreateProjectHandler } from "@infrastructure/http/factories/project/create-project"
import { createNewProject } from "@infrastructure/dependencies"

export const handler = createCreateProjectHandler(createNewProject)
