import { ActivityType, CommentLeftMetadata } from "@jigjoy-io/task-contracts"
import { Activity } from "@domain/task/activity/activity"
import { Task } from "@domain/task/task"

export class CommentLeft extends Activity<CommentLeftMetadata> {
	constructor(
		id: string,
		type: ActivityType.COMMENT_LEFT,
		projectId: string,
		taskId: string,
		userId: string,
		metadata: CommentLeftMetadata,
		occurredAt: string,
	) {
		super(id, type, projectId, taskId, userId, metadata, occurredAt)
	}

	static create(task: Task, authorId: string, commentText: string): Activity<CommentLeftMetadata> {
		const id = this.generateId()
		const type = ActivityType.COMMENT_LEFT
		const occurredAt = this.now()

		const metadata: CommentLeftMetadata = {
			commentText: commentText,
			authorId: authorId,
		}

		return new CommentLeft(id, type, task.projectId, task.id, authorId, metadata, occurredAt)
	}
}
