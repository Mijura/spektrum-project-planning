import { Project } from "@domain/project/project"
import { ArchiveProjectPort } from "@application/ports/inbound/project/archive-project"
import { ProjectRepository } from "@application/ports/outbound/project-repository"
import { ProjectDTO } from "@application/dto/project"
import { ProjectMapper } from "@application/mappers/project-mappers"

export class ArchiveProjectUseCase implements ArchiveProjectPort {
	
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<ProjectDTO> {
		const project: Project = await this.projectRepository.get(projectId)
		project.archive()
		const archivedProject: Project = await this.projectRepository.save(project)
		return ProjectMapper.toDto(archivedProject)
	}
}
