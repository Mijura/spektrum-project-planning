import { Task } from "@domain/task/task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { UpdateTaskTitlePort } from "@app/ports/use-cases/task/update-title"

export class UpdateTaskTitleUseCase implements UpdateTaskTitlePort {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(taskId: string, newTitle: string): Promise<Task> {
		try {
			// fetch the old task and update it
			console.log(`Updating task title for task ${taskId} to ${newTitle}.`)
			const task: Task | null = await this.taskRepository.get(taskId)

			if (!task) {
				throw new Error("Task not found.")
			}

			// TODO: Get the user id from the context
			task.updateTitle("User", newTitle)

			// Persist the task in the database
			const savedTask: Task = await this.taskRepository.save(task)
			return savedTask
		} catch (error) {
			console.error("Error during task title update:", error)
			throw new Error("Failed to edit task title.")
		}
	}
}
