import { TaskDTO } from "@app/dto/task"
import { TaskMapper } from "@app/mappers/task-mapper"
import { Task } from "@domain/task/task"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { FetchTasksPort } from "@app/ports/use-cases/task/fetch-tasks"

export class FetchTasksUseCase implements FetchTasksPort {
	
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(projectId: string): Promise<TaskDTO[]> {
		const tasks: Task[] = await this.taskRepository.getAll(projectId)
		return TaskMapper.toDTOs(tasks)
	}
}
