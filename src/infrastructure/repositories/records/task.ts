import { ActivityMetadata, ActivityType, TaskStatus } from "@jigjoy-io/task-contracts"

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
