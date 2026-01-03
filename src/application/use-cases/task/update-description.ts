import { Task } from "@domain/task/task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { UpdateTaskDescriptionPort } from "@app/ports/use-cases/task/update-description"

export class UpdateTaskDescriptionUseCase implements UpdateTaskDescriptionPort {

	constructor(
		private readonly taskRepository: TaskRepository
	) {}

	async execute(taskId: string, newDescription: string): Promise<Task> {
		try {
			// fetch the old task and update it
			console.log(`Updating task description for task ${taskId} to ${newDescription}.`)
            const task: Task | null = await this.taskRepository.get(taskId)

            if (!task) {
                throw new Error("Task not found.")
            }

			// TODO: Get the user id from the context
            task.updateDescription("User", newDescription)


			// Persist the task in the database
			const savedTask: Task = await this.taskRepository.save(task)
			return savedTask
		} catch (error) {
			console.error("Error during task description update:", error)
			throw new Error("Failed to edit task description.")
		}
	}
}
