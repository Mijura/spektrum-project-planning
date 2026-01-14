import { Project } from "@domain/project/project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { UpdateProjectDetailsUseCase } from "@app/ports/use-cases/project/update-details"

export class UpdateProjectDetails implements UpdateProjectDetailsUseCase {
	constructor(private readonly projectRepository: ProjectRepository) {}

	async execute(projectId: string, newName: string, newDescription: string): Promise<Project> {
		try {
			console.log(`Updating project details for project ${projectId}`)
			const project: Project | null = await this.projectRepository.get(projectId)

			if (!project) {
				throw new Error("Project not found.")
			}

			// Update project details
			project.setName(newName)
			project.setDescription(newDescription)

			return await this.projectRepository.save(project)
		} catch (error) {
			console.error("Error during project details update:", error)
			throw new Error("Failed to update project details.")
		}
	}
}
