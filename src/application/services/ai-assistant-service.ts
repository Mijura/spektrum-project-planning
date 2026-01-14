import { ProjectDetailsGenerator } from "@app/ports/ai-assistant-service/project-details-generator"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { ProjectDetails } from "@app/types/project-details"
import { Project } from "@domain/project/project"
import { Task } from "@domain/task/task"

export class AIAssistantService {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly projectDetailsGenerator: ProjectDetailsGenerator
	) {}

	async updateProjectDetails(task: Task): Promise<Project> {
		const project = await this.projectRepository.get(task.projectId)
		if (!project) {
			throw new Error("Project not found")
		}

		if (!project.detailsUpdated) {
			const projectDetails: ProjectDetails = await this.projectDetailsGenerator.generateProjectDetails(task)
			console.log("Project details generated:", projectDetails)
			project.setDetails(projectDetails.name, projectDetails.description)
			return await this.projectRepository.save(project)
		}

		return project
	}

}
