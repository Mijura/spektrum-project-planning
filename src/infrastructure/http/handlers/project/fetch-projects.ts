import { createFetchProjectsHandler } from "@infrastructure/http/factories/project/fetch-projects"
import { fetchProjects } from "@infrastructure/dependencies"

export const handler = createFetchProjectsHandler(fetchProjects)
