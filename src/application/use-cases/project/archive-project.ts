import { Project } from "@domain/project/project"
import { ArchiveProjectParams, ArchiveProjectUseCase } from "@app/ports/use-cases/project/archive-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class ArchiveProject implements ArchiveProjectUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(auth: Auth<UserData>, params: ArchiveProjectParams): Promise<Project> {

		console.log(`Autd data: ${JSON.stringify(auth.data)}`)

		const project: Project = await this.projectRepository.get(params.projectId)
		project.archive()
		return await this.projectRepository.save(project)
	}
}
