import { ActivityType, TaskCreatedMetadata } from "@jigjoy-io/task-contracts"
import { Activity } from "@domain/task/activity/activity"
import { Task } from "@domain/task/task"

export class TaskCreated extends Activity<TaskCreatedMetadata> {
	
    constructor(
        id: string,
        type: ActivityType.TASK_CREATED,
        projectId: string,
        taskId: string,
        userId: string, 
        metadata: TaskCreatedMetadata, 
        occurredAt: string
    ) {
		super(id, type, projectId, taskId, userId, metadata, occurredAt)
	}

    static create(userId: string, task: Task): Activity<TaskCreatedMetadata> {
		
        const id = this.generateId()
		const type = ActivityType.TASK_CREATED
		const occurredAt = this.now()

        const message = `${userId} created task`
		const metadata: TaskCreatedMetadata = {
			message: message,
			title: task.title,
			description: task.description
		}
	
		return new TaskCreated(id, type, task.projectId, task.id, userId, metadata, occurredAt)
    }
}