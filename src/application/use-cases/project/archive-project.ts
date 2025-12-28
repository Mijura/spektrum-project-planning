import { Project } from "@domain/entities/project"
import { ArchiveProject } from "@application/ports/inbound/project/archive-project"
import { ProjectRepository } from "@application/ports/outbound/project-repository"
import { ProjectDTO } from "@application/dto/project"
import { ProjectMapper } from "@application/mappers/project-mappers"

export class ArchiveProjectUseCase implements ArchiveProject {
	
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<ProjectDTO> {
		const project: Project = await this.projectRepository.get(projectId)
		project.archive()
		const archivedProject: Project = await this.projectRepository.save(project)
		return ProjectMapper.toResponse(archivedProject)
	}
}
