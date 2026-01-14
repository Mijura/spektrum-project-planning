import { Task } from "@domain/task/task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { FetchTasksUseCase } from "@app/ports/use-cases/task/fetch-tasks"

export class FetchTasks implements FetchTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(projectId: string): Promise<Task[]> {
		return await this.taskRepository.getAll(projectId)
	}
}
