import { FetchProjectParams, FetchProjectUseCase } from "@app/ports/use-cases/project/fetch-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Project } from "@domain/project/project"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class FetchProject implements FetchProjectUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(auth: Auth<UserData>, params: FetchProjectParams): Promise<Project> {
		console.log(`Auth data: ${JSON.stringify(auth.data)}`)

		const { projectId } = params
		return await this.projectRepository.get(projectId)
	}
}
