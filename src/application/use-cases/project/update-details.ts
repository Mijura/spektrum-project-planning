import { Project } from "@domain/project/project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { UpdateProjectDetailsParams, UpdateProjectDetailsUseCase } from "@app/ports/use-cases/project/update-details"
import { AuthContext, requireAuthenticated } from "@heksagon/app"

export class UpdateProjectDetails implements UpdateProjectDetailsUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(params: UpdateProjectDetailsParams, authContext: AuthContext): Promise<Project> {
		requireAuthenticated(authContext)

		const { projectId, newName, newDescription } = params

		console.log(`Updating project details for project ${projectId}`)
		const project: Project | null = await this.projectRepository.get(projectId)

		if (!project) {
			throw new Error("Project not found.")
		}

		// Update project details
		project.setName(newName)
		project.setDescription(newDescription)

		return await this.projectRepository.save(project)
	}
}
