import { Project } from "@domain/project/project"
import { FetchProjectsUseCase } from "@app/ports/use-cases/project/fetch-projects"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { ProjectStatus } from "@domain/project/project-status"
import { AuthContext, requireAuthenticated, requireUserId } from "@heksagon/app"

export class FetchProjects implements FetchProjectsUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(params: null, authContext: AuthContext): Promise<Project[]> {
		requireAuthenticated(authContext)

		const userId = requireUserId(authContext)
		return await this.projectRepository.getAllByStatus(userId, ProjectStatus.ACTIVE)
	}
}
