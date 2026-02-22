import { Project } from "@domain/project/project"
import { ArchiveProjectParams, ArchiveProjectUseCase } from "@app/ports/use-cases/project/archive-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { AuthContext, requireAuthenticated } from "@heksagon/app"

export class ArchiveProject implements ArchiveProjectUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(params: ArchiveProjectParams, authContext: AuthContext): Promise<Project> {
		requireAuthenticated(authContext)

		const project: Project = await this.projectRepository.get(params.projectId)
		project.archive()
		return await this.projectRepository.save(project)
	}
}
