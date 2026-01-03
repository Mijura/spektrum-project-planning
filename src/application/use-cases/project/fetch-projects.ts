import { Project } from "@domain/project/project"
import { FetchProjectsPort } from "@app/ports/use-cases/project/fetch-projects"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { ProjectStatus } from "@domain/project/project-status"

export class FetchProjectsUseCase implements FetchProjectsPort {

	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(ownerId: string): Promise<Project[]> {
		const projects: Project[] = await this.projectRepository.getAllByStatus(ownerId, ProjectStatus.ACTIVE)
		return projects
	}
}
