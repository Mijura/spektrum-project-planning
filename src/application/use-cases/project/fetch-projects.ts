import { Project } from "@domain/project/project"
import { FetchProjectsUseCase } from "@app/ports/use-cases/project/fetch-projects"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { ProjectStatus } from "@domain/project/project-status"
import { AuthContext, requireUserId } from "@jigjoy-ai/auth-context"

export class FetchProjects implements FetchProjectsUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(authContext: AuthContext): Promise<Project[]> {
		const userId = requireUserId(authContext)
		return await this.projectRepository.getAllByStatus(userId, ProjectStatus.ACTIVE)
	}
}
