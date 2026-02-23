import { CreateTaskParams, CreateTaskUseCase } from "@app/ports/use-cases/task/create-task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { ProjectDetailsService } from "@app/services/project-details-service"
import { Task } from "@domain/task/task"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class CreateTask implements CreateTaskUseCase {
	constructor(
		private readonly projectDetailsService: ProjectDetailsService,
		private readonly taskRepository: TaskRepository,
	) {}

	async execute(auth: Auth<UserData>, params: CreateTaskParams): Promise<Task> {
		console.log(`Auth data: ${JSON.stringify(auth.data)}`)

		const { projectId, title, description } = params

		const task: Task = Task.create("User", projectId, title, description)

		await this.projectDetailsService.ensureProjectDetailsFromTask(task)

		return await this.taskRepository.save(task)
	}
}
