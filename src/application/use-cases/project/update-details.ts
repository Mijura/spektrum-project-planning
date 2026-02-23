import { Project } from "@domain/project/project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { UpdateProjectDetailsParams, UpdateProjectDetailsUseCase } from "@app/ports/use-cases/project/update-details"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class UpdateProjectDetails implements UpdateProjectDetailsUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(auth: Auth<UserData>, params: UpdateProjectDetailsParams): Promise<Project> {

		console.log(`Auth data: ${JSON.stringify(auth.data)}`)

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
