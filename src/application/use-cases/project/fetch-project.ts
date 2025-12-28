
import { FetchProjectPort } from "@application/ports/inbound/project/fetch-project"
import { ProjectRepository } from "@application/ports/outbound/project-repository"
import { ProjectDTO } from "@application/dto/project"
import { ProjectMapper } from "@application/mappers/project-mappers"
import { Project } from "@domain/project/project"

export class FetchProjectUseCase implements FetchProjectPort {

	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<ProjectDTO> {
		const project: Project = await this.projectRepository.get(projectId)
		return ProjectMapper.toDto(project)
	}
}
