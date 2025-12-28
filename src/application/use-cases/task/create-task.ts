import { CreateTaskPort } from "@application/ports/use-cases/task/create-task"
import { Task } from "@domain/task/task"
import { TaskRepository } from "@application/ports/repositories/task-repository"
import { TaskMapper } from "@application/mappers/task-mapper"
import { TaskDTO } from "@application/dto/task"
import { AIAssistantServicePort } from "@application/ports/services/ai-asisstant-service"

export class CreateTaskUseCase implements CreateTaskPort {
	
	constructor(
		private readonly aiAssistantService: AIAssistantServicePort,
		private readonly taskRepository: TaskRepository,
	) {}

	async execute(projectId: string, title: string, description: string): Promise<TaskDTO> {
		try {
			// Create a new task
			const task: Task = Task.create('User', projectId, title, description)

			await this.aiAssistantService.updateProjectDetails(task)
			// Persist the task in the database
			const savedTask: Task = await this.taskRepository.save(task)

			return TaskMapper.toDTO(savedTask)
		} catch (error) {
			console.error("Error creating new task:", error)
			throw new Error("Failed to create new task.")
		}
	}
}
