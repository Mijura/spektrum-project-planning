import { CreateProjectUseCase } from "@app/ports/use-cases/project/create-project"
import { CreateProject } from "@app/use-cases/project/create-project"
import { createCreateProjectHandler } from "@infra/http/factories/project/create-project"
import { projectRepository } from "@infra/repositories/project-repository"
import { aiCodingService } from "@infra/services/ai-coding-service"
import { projectDeploymentService } from "@infra/services/project-deployment-service"

export const createNewProject: CreateProjectUseCase = new CreateProject(
	projectRepository,
	aiCodingService,
	projectDeploymentService,
)

export const handler = createCreateProjectHandler(createNewProject)
