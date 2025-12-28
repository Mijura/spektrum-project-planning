import { Task } from "@domain/entities/task"
import { TaskDTO } from "@application/dto/task"

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
			activities: task.getActivityLog().map(activity => {
                return {
                    id: activity.id,
                    type: activity.type,
                    projectId: activity.projectId,
                    taskId: activity.taskId,
                    userId: activity.userId,
                    metadata: activity.metadata,
                    occurredAt: activity.occurredAt,
                }
            })
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
