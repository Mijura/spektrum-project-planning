import { FetchProjectParams, FetchProjectUseCase } from "@app/ports/use-cases/project/fetch-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Project } from "@domain/project/project"
import { AuthContext, requireAuthenticated } from "@heksagon/app"

export class FetchProject implements FetchProjectUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(params: FetchProjectParams, authContext: AuthContext): Promise<Project> {
		requireAuthenticated(authContext)

		const { projectId } = params
		return await this.projectRepository.get(projectId)
	}
}
