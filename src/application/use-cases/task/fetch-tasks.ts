import { TaskDTO } from "@application/dto/task"
import { TaskMapper } from "@application/mappers/task-mapper"
import { Task } from "@domain/task/task"
import { TaskRepository } from "@application/ports/repositories/task-repository"
import { FetchTasksPort } from "@application/ports/use-cases/task/fetch-tasks"

export class FetchTasksUseCase implements FetchTasksPort {
	
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(projectId: string): Promise<TaskDTO[]> {
		const tasks: Task[] = await this.taskRepository.getAll(projectId)
		return TaskMapper.toDTOs(tasks)
	}
}
