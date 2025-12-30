import { Project } from "@domain/project/project"
import { ArchiveProjectPort } from "@app/ports/use-cases/project/archive-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { ProjectDTO } from "@app/dto/project"
import { ProjectMapper } from "@app/mappers/project-mappers"

export class ArchiveProjectUseCase implements ArchiveProjectPort {
	
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<ProjectDTO> {
		const project: Project = await this.projectRepository.get(projectId)
		project.archive()
		const archivedProject: Project = await this.projectRepository.save(project)
		return ProjectMapper.toDto(archivedProject)
	}
}
