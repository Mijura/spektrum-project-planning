import { Project } from "@domain/entities/project"
import { FetchProjects } from "@application/ports/inbound/project/fetch-projects"
import { ProjectRepository } from "@application/ports/outbound/project-repository"
import { ProjectDTO } from "@application/dto/project"
import { ProjectMapper } from "@application/mappers/project-mappers"
import { ProjectStatus } from "@domain/value-objects/project"

export class FetchProjectsUseCase implements FetchProjects {

	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(ownerId: string): Promise<ProjectDTO[]> {
		const projects: Project[] = await this.projectRepository.getAllByStatus(ownerId, ProjectStatus.ACTIVE)
		return ProjectMapper.toDtos(projects)
	}
}
