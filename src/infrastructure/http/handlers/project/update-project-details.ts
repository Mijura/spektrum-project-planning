import { UpdateProjectDetailsUseCase } from "@app/ports/use-cases/project/update-details"
import { UpdateProjectDetails } from "@app/use-cases/project/update-details"
import { createUpdateProjectDetailsHandler } from "@infra/http/factories/project/update-project-details"
import { projectRepository } from "@infra/repositories/project-repository"

export const updateProjectDetails: UpdateProjectDetailsUseCase = new UpdateProjectDetails(projectRepository)

export const handler = createUpdateProjectDetailsHandler(updateProjectDetails)
