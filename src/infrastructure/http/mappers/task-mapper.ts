import { Task } from "@domain/task/task"
import { Task as TaskDTO } from "@jigjoy-io/task-contracts"
import { ActivityMapper } from "./activity-mapper"

export class TaskMapper {

	/** Convert Task entity → marshalled task for storage/transfer */
	static toDTO(task: Task): TaskDTO {

		return {
			id: task.id,
			projectId: task.projectId,
			title: task.title,
			description: task.description,
			status: task.status,
			created: task.created,
			updated: task.updated,
			activities: ActivityMapper.toDTOs(task.getActivityLog())
		}
	}

	static toDTOs(tasks: Task[]): TaskDTO[] {
		return tasks.map(this.toDTO)
	}

	/** Convert marshalled task (e.g., from DB) → Task entity */
	static toDomain(data: TaskDTO): Task {

		return Task.rehydrate({
			id: data.id, 
			created: data.created, 
			projectId: data.projectId, 
			title: data.title, 
			description: data.description, 
			status: data.status, 
			updated: data.updated,
			activities: data.activities
		})
	}

	static toDomains(items: TaskDTO[]): Task[] {
		return items.map(this.toDomain)
	}
}
