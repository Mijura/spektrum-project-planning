import { TaskDTO } from "@application/dto/task"
import { TaskMapper } from "@application/mappers/task-mapper"
import { Task } from "@domain/task/task"
import { TaskRepository } from "@application/ports/repositories/task-repository"
import { UpdateTaskTitlePort } from "@application/ports/use-cases/task/update-title"

export class UpdateTaskTitleUseCase implements UpdateTaskTitlePort {
	
	constructor(
		private readonly taskRepository: TaskRepository
	) {}

	async execute(taskDto: TaskDTO): Promise<TaskDTO> {
		try {
			// fetch the old task and update it
			console.log(`Updating task title for task ${taskDto.id} to ${taskDto.title}.`)
            const task: Task | null = await this.taskRepository.get(taskDto.id)

            if (!task) {
                throw new Error("Task not found.")
            }

			// TODO: Get the user id from the context
			task.updateTitle("User", taskDto.title)

			// Persist the task in the database
			const savedTask: Task = await this.taskRepository.save(task)
			return TaskMapper.toDTO(savedTask)
		} catch (error) {
			console.error("Error during task title update:", error)
			throw new Error("Failed to edit task title.")
		}
	}
}
