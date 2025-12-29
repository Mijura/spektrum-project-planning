
import { TaskStatus } from "@domain/task/task-status"
import { ActivityDTO } from "./activity"

export type TaskDTO = {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: TaskStatus
	activities: ActivityDTO[]
}