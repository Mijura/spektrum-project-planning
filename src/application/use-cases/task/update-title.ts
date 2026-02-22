import { Task } from "@domain/task/task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { UpdateTaskTitleParams, UpdateTaskTitleUseCase } from "@app/ports/use-cases/task/update-title"
import { AuthContext, requireAuthenticated } from "@heksagon/app"

export class UpdateTaskTitle implements UpdateTaskTitleUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(params: UpdateTaskTitleParams, authContext: AuthContext): Promise<Task> {
		requireAuthenticated(authContext)

		const { taskId, newTitle } = params

		// fetch the old task and update it
		console.log(`Updating task title for task ${taskId} to ${newTitle}.`)
		const task: Task | null = await this.taskRepository.get(taskId)

		if (!task) {
			throw new Error("Task not found.")
		}

		// TODO: Get the user id from the context
		task.updateTitle("User", newTitle)

		// Persist the task in the database
		return await this.taskRepository.save(task)
	}
}
