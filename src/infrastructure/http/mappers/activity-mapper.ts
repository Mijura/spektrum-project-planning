import { CommentLeft } from "@domain/task/activity/activities/comment-left"
import { DescriptionUpdated } from "@domain/task/activity/activities/description-updated"
import { FinishedWork } from "@domain/task/activity/activities/finished-work"
import { StartedWork } from "@domain/task/activity/activities/started-work"
import { TaskCreated } from "@domain/task/activity/activities/task-created"
import { TitleUpdated } from "@domain/task/activity/activities/title-updated"
import { Activity } from "@domain/task/activity/activity"
import { Activity as ActivityDTO, ActivityMetadata, ActivityType } from "@jigjoy-ai/task-contracts"

export class ActivityMapper {
	static toDTO(activity: Activity<ActivityMetadata>): ActivityDTO {
		switch (activity.type) {
			case ActivityType.COMMENT_LEFT: {
				const a = activity as CommentLeft
				return {
					id: a.id,
					type: ActivityType.COMMENT_LEFT,
					projectId: a.projectId,
					taskId: a.taskId,
					userId: a.userId,
					occurredAt: a.occurredAt,
					metadata: {
						commentText: a.metadata.commentText,
						authorId: a.metadata.authorId,
					},
				}
			}
			case ActivityType.DESCRIPTION_UPDATED: {
				const a = activity as DescriptionUpdated
				return {
					id: a.id,
					type: ActivityType.DESCRIPTION_UPDATED,
					projectId: a.projectId,
					taskId: a.taskId,
					userId: a.userId,
					occurredAt: a.occurredAt,
					metadata: {
						message: a.metadata.message,
						oldDescription: a.metadata.oldDescription,
						newDescription: a.metadata.newDescription,
					},
				}
			}
			case ActivityType.FINISHED_WORK: {
				const a = activity as FinishedWork
				return {
					id: a.id,
					type: ActivityType.FINISHED_WORK,
					projectId: a.projectId,
					taskId: a.taskId,
					userId: a.userId,
					occurredAt: a.occurredAt,
					metadata: {
						workerId: a.metadata.workerId,
						message: a.metadata.message,
					},
				}
			}

			case ActivityType.STARTED_WORK: {
				const a = activity as StartedWork
				return {
					id: a.id,
					type: ActivityType.STARTED_WORK,
					projectId: a.projectId,
					taskId: a.taskId,
					userId: a.userId,
					occurredAt: a.occurredAt,
					metadata: {
						workerId: a.metadata.workerId,
						message: a.metadata.message,
					},
				}
			}
			case ActivityType.TASK_CREATED: {
				const a = activity as TaskCreated
				return {
					id: a.id,
					type: ActivityType.TASK_CREATED,
					projectId: a.projectId,
					taskId: a.taskId,
					userId: a.userId,
					occurredAt: a.occurredAt,
					metadata: {
						message: a.metadata.message,
						title: a.metadata.title,
						description: a.metadata.description,
					},
				}
			}
			case ActivityType.TITLE_UPDATED: {
				const a = activity as TitleUpdated
				return {
					id: a.id,
					type: ActivityType.TITLE_UPDATED,
					projectId: a.projectId,
					taskId: a.taskId,
					userId: a.userId,
					occurredAt: a.occurredAt,
					metadata: {
						message: a.metadata.message,
						oldTitle: a.metadata.oldTitle,
						newTitle: a.metadata.newTitle,
					},
				}
			}
			default: {
				const exhaustive: never = activity.type as never
				throw new Error(`ActivityMapper.toDTO: unsupported activity type: ${String(exhaustive)}`)
			}
		}
	}

	static toDTOs(activities: Activity<ActivityMetadata>[]): ActivityDTO[] {
		return activities.map(this.toDTO)
	}
}
