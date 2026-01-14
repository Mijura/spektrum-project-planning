import { Project } from "@domain/project/project"
import { FetchProjectsUseCase } from "@app/ports/use-cases/project/fetch-projects"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { ProjectStatus } from "@domain/project/project-status"

export class FetchProjects implements FetchProjectsUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(ownerId: string): Promise<Project[]> {
		return await this.projectRepository.getAllByStatus(ownerId, ProjectStatus.ACTIVE)
	}
}
