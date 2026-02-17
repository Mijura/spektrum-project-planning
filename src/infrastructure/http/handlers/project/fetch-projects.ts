import { FetchProjectsUseCase } from "@app/ports/use-cases/project/fetch-projects"
import { FetchProjects } from "@app/use-cases/project/fetch-projects"
import { createFetchProjectsHandler } from "@infra/http/factories/project/fetch-projects"
import { projectRepository } from "@infra/repositories/project-repository"

export const fetchProjects: FetchProjectsUseCase = new FetchProjects(projectRepository)

export const handler = createFetchProjectsHandler(fetchProjects)
