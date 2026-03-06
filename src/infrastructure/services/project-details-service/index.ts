import { ProjectDetailsService } from "@app/services/project-details-service"
import { projectDetailsGenerator } from "@infra/generators/project-details-generator"
import { projectRepository } from "@infra/repositories/project-repository"

export const projectDetailsService: ProjectDetailsService = new ProjectDetailsService(
	projectRepository,
	projectDetailsGenerator,
)
