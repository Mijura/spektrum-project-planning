import { Project } from "@domain/project/project"
import { ArchiveProjectPort } from "@app/ports/use-cases/project/archive-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"

export class ArchiveProjectUseCase implements ArchiveProjectPort {
	
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<Project> {
		const project: Project = await this.projectRepository.get(projectId)
		project.archive()
		const archivedProject: Project = await this.projectRepository.save(project)
		return archivedProject
	}
}
