import { createFetchProjectHandler } from "@infrastructure/http/factories/project/fetch-project"
import { fetchProject } from "@infrastructure/dependencies"

export const handler = createFetchProjectHandler(fetchProject)
