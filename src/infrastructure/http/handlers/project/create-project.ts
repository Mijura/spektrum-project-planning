import { createCreateProjectHandler } from "@infra/http/factories/project/create-project"
import { createNewProject } from "@infra/dependencies"

export const handler = createCreateProjectHandler(createNewProject)
