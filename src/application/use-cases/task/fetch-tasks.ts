import { TaskDTO } from "@application/dto/task"
import { TaskMapper } from "@application/mappers/task-mapper"
import { Task } from "@domain/task/task"
import { TaskRepository } from "@application/ports/outbound/task-repository"
import { FetchTasksPort } from "@application/ports/inbound/task/fetch-tasks"

export class FetchTasksUseCase implements FetchTasksPort {
	
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(projectId: string): Promise<TaskDTO[]> {
		const tasks: Task[] = await this.taskRepository.getAll(projectId)
		return TaskMapper.toDTOs(tasks)
	}
}
