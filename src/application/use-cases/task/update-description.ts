import { Task } from "@domain/task/task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { UpdateTaskDescriptionParams, UpdateTaskDescriptionUseCase } from "@app/ports/use-cases/task/update-description"
import { AuthContext, requireAuthenticated } from "@heksagon/app"

export class UpdateTaskDescription implements UpdateTaskDescriptionUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(params: UpdateTaskDescriptionParams, authContext: AuthContext): Promise<Task> {
		requireAuthenticated(authContext)

		const { taskId, newDescription } = params

		// fetch the old task and update it
		console.log(`Updating task description for task ${taskId} to ${newDescription}.`)
		const task: Task | null = await this.taskRepository.get(taskId)

		if (!task) {
			throw new Error("Task not found.")
		}

		// TODO: Get the user id from the context
		task.updateDescription("User", newDescription)

		return await this.taskRepository.save(task)
	}
}
