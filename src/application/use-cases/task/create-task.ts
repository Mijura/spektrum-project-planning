import { CreateTask } from "@application/ports/inbound/task/create-task"
import { Task } from "@domain/entities/task"
import { TaskRepository } from "@application/ports/outbound/task-repository"
import { MarketingService } from "@application/ports/inbound/marketing-service"
import { TaskMapper } from "@application/mappers/task-mapper"
import { TaskDTO } from "@application/dto/task"

export class CreateTaskUseCase implements CreateTask {
	
	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly marketingService: MarketingService,

	) {}

	async execute(projectId: string, title: string, description: string): Promise<TaskDTO> {
		try {
			// Create a new task
			const task: Task = Task.create('User', projectId, title, description)

			await this.marketingService.updateProjectDetails(task)
			// Persist the task in the database
			const savedTask: Task = await this.taskRepository.save(task)

			return TaskMapper.toDTO(savedTask)
		} catch (error) {
			console.error("Error creating new task:", error)
			throw new Error("Failed to create new task.")
		}
	}
}
