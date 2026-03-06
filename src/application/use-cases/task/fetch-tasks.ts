import { Task } from "@domain/task/task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { FetchTasksParams, FetchTasksUseCase } from "@app/ports/use-cases/task/fetch-tasks"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class FetchTasks implements FetchTasksUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(auth: Auth<UserData>, params: FetchTasksParams): Promise<Task[]> {
		console.log(`Auth data: ${JSON.stringify(auth.data)}`)

		const { projectId } = params

		return await this.taskRepository.getAll(projectId)
	}
}
