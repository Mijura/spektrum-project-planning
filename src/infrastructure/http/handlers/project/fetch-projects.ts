import { createFetchProjectsHandler } from "@infra/http/factories/project/fetch-projects"
import { fetchProjects } from "@infra/dependencies"

export const handler = createFetchProjectsHandler(fetchProjects)
