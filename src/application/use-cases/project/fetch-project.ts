
import { FetchProjectPort } from "@app/ports/use-cases/project/fetch-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Project } from "@domain/project/project"

export class FetchProjectUseCase implements FetchProjectPort {

	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<Project> {
		const project: Project = await this.projectRepository.get(projectId)
		return project
	}
}
