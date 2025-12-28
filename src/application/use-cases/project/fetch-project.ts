
import { FetchProjectPort } from "@application/ports/use-cases/project/fetch-project"
import { ProjectRepository } from "@application/ports/repositories/project-repository"
import { ProjectDTO } from "@application/dto/project"
import { ProjectMapper } from "@application/mappers/project-mappers"
import { Project } from "@domain/project/project"

export class FetchProjectUseCase implements FetchProjectPort {

	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string): Promise<ProjectDTO> {
		const project: Project = await this.projectRepository.get(projectId)
		return ProjectMapper.toDto(project)
	}
}
