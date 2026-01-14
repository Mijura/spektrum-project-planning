import { FetchProjectUseCase } from "@app/ports/use-cases/project/fetch-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Project } from "@domain/project/project"

export class FetchProject implements FetchProjectUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<Project> {
		const project: Project = await this.projectRepository.get(projectId)
		return project
	}
}
