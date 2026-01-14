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
		const task: Task = Task.create("User", projectId, title, description)

		await this.projectDetailsService.ensureProjectDetailsFromTask(task)

		return await this.taskRepository.save(task)
	}
}
