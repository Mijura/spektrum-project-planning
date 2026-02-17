import { FetchProjectUseCase } from "@app/ports/use-cases/project/fetch-project"
import { FetchProject } from "@app/use-cases/project/fetch-project"
import { createFetchProjectHandler } from "@infra/http/factories/project/fetch-project"
import { projectRepository } from "@infra/repositories/project-repository"

export const fetchProject: FetchProjectUseCase = new FetchProject(projectRepository)
export const handler = createFetchProjectHandler(fetchProject)
