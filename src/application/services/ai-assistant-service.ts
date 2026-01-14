import { ProjectDetailsGenerator } from "@app/ports/ai-assistant-service/project-details-generator"
import { TasksGenerator } from "@app/ports/ai-assistant-service/tasks-generator"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { ProjectDetails } from "@app/types/project-details"
import { Project } from "@domain/project/project"
import { Task } from "@domain/task/task"

export class AIAssistantService {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly taskRepository: TaskRepository,
		private readonly projectDetailsGenerator: ProjectDetailsGenerator,
		private readonly tasksGenerator: TasksGenerator,
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

	async planTasks(projectId: string, projectDescription: string): Promise<Task[]> {

		const tasks = await this.tasksGenerator.generateTasks(projectId, projectDescription)

		// Save all tasks
		const taskPromises = []
		for (const t of tasks) {
			const taskPromise = this.taskRepository.save(t)
			taskPromises.push(taskPromise)
		}

		await Promise.all(taskPromises)

		return tasks
	}
}
