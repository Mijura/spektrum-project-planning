import { Project } from "@domain/project/project"
import { FetchProjectsPort } from "@application/ports/use-cases/project/fetch-projects"
import { ProjectRepository } from "@application/ports/repositories/project-repository"
import { ProjectDTO } from "@application/dto/project"
import { ProjectMapper } from "@application/mappers/project-mappers"
import { ProjectStatus } from "@domain/project/project-status"

export class FetchProjectsUseCase implements FetchProjectsPort {

	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(ownerId: string): Promise<ProjectDTO[]> {
		const projects: Project[] = await this.projectRepository.getAllByStatus(ownerId, ProjectStatus.ACTIVE)
		return ProjectMapper.toDtos(projects)
	}
}
