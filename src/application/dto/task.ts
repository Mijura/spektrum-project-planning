
import { ActivityPrimitives } from "@domain/task/activity/activity-primitives"
import { TaskStatus } from "@domain/task/task-status"

export interface TaskDTO {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: TaskStatus
	activities: ActivityPrimitives[]
}