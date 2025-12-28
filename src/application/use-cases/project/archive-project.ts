import { Project } from "@domain/project/project"
import { ArchiveProjectPort } from "@application/ports/use-cases/project/archive-project"
import { ProjectRepository } from "@application/ports/repositories/project-repository"
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
