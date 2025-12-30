import { createFetchProjectHandler } from "@infra/http/factories/project/fetch-project"
import { fetchProject } from "@infra/dependencies"

export const handler = createFetchProjectHandler(fetchProject)
