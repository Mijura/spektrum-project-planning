import { ActivityMetadata } from "@domain/task/activity/activities/activitiy-metadata"
import { ActivityType } from "@domain/task/activity/activity-type"
import { TaskStatus } from "@domain/task/task-status"

export type ActivityRecord = {
	id: string
	type: ActivityType
	projectId: string
	taskId: string
	userId: string
	metadata: ActivityMetadata
	occurredAt: string
}

export interface TaskRecord {
	id: string
	title: string
	description: string
	projectId: string
	created: string
	updated: string | null
	status: TaskStatus
	activities: ActivityRecord[]
}