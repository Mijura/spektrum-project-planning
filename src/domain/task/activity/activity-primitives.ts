import { ActivityType } from "./activity-type"
import { ActivityMetadata } from "./activities/activitiy-metadata"

export type ActivityPrimitives = {
	id: string
	type: ActivityType
	projectId: string
	taskId: string
	userId: string
	metadata: ActivityMetadata
	occurredAt: string
}