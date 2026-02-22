import { Task } from "@domain/task/task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { FetchTasksParams, FetchTasksUseCase } from "@app/ports/use-cases/task/fetch-tasks"
import { AuthContext, requireAuthenticated } from "@heksagon/app"

export class FetchTasks implements FetchTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(params: FetchTasksParams, authContext: AuthContext): Promise<Task[]> {
		requireAuthenticated(authContext)

		const { projectId } = params

		return await this.taskRepository.getAll(projectId)
	}
}
