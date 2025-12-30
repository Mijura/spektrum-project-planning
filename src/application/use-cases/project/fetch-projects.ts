import { Project } from "@domain/project/project"
import { FetchProjectsPort } from "@app/ports/use-cases/project/fetch-projects"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { ProjectDTO } from "@app/dto/project"
import { ProjectMapper } from "@app/mappers/project-mappers"
import { ProjectStatus } from "@domain/project/project-status"

export class FetchProjectsUseCase implements FetchProjectsPort {

	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(ownerId: string): Promise<ProjectDTO[]> {
		const projects: Project[] = await this.projectRepository.getAllByStatus(ownerId, ProjectStatus.ACTIVE)
		return ProjectMapper.toDtos(projects)
	}
}
