import { Project } from "@domain/project/project"
import { FetchProjectsUseCase } from "@app/ports/use-cases/project/fetch-projects"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { ProjectStatus } from "@domain/project/project-status"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class FetchProjects implements FetchProjectsUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(auth: Auth<UserData>): Promise<Project[]> {

		console.log(`Auth data: ${JSON.stringify(auth.data)}`)
		return await this.projectRepository.getAllByStatus(auth.data.userId, ProjectStatus.ACTIVE)
	}
}
