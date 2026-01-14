import { CreateTaskUseCase } from "@app/ports/use-cases/task/create-task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { ProjectDetailsService } from "@app/services/project-details-service"
import { Task } from "@domain/task/task"

export class CreateTask implements CreateTaskUseCase {
	constructor(
		private readonly projectDetailsService: ProjectDetailsService,
		private readonly taskRepository: TaskRepository,
	) {}

	async execute(projectId: string, title: string, description: string): Promise<Task> {
		try {
			// Create a new task
			const task: Task = Task.create("User", projectId, title, description)

			await this.projectDetailsService.ensureProjectDetailsFromTask(task)

			return await this.taskRepository.save(task)
		} catch (error) {
			console.error("Error creating new task:", error)
			throw new Error("Failed to create new task.")
		}
	}
}
