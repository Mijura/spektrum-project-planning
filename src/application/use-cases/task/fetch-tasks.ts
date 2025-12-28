import { TaskDTO } from "@application/dto/task"
import { TaskMapper } from "@application/mappers/task-mapper"
import { Task } from "@domain/entities/task"
import { TaskRepository } from "@application/ports/outbound/task-repository"
import { FetchTasks } from "@application/ports/inbound/task/fetch-tasks"

export class FetchTasksUseCase implements FetchTasks {
	
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(projectId: string): Promise<TaskDTO[]> {
		const tasks: Task[] = await this.taskRepository.getAll(projectId)
		return TaskMapper.toDTOs(tasks)
	}
}
