import { ActivityMetadata } from "@domain/task/activity/activities/activitiy-metadata"
import { ActivityType } from "@domain/task/activity/activity-type"

export type ActivityDTO = {
	id: string
	type: ActivityType
	projectId: string
	taskId: string
	userId: string
	metadata: ActivityMetadata
	occurredAt: string
}