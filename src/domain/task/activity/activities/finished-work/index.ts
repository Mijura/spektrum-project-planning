import { ActivityType } from "@domain/task/activity/activity-type"
import { Activity } from "@domain/task/activity/activity"
import { Task } from "@domain/task/task"
import { FinishedWorkMetadata } from "./metadata"

export class FinishedWork extends Activity<FinishedWorkMetadata> {
    constructor(
        id: string,
        type: ActivityType.FINISHED_WORK,
        projectId: string,
        taskId: string,
        workerId: string,
        metadata: FinishedWorkMetadata,
        occurredAt: string
    ) {
        super(id, type, projectId, taskId, workerId, metadata, occurredAt)
    }

    static create(workerId: string, task: Task, message: string): Activity<FinishedWorkMetadata> {
        const id = this.generateId()
        const type = ActivityType.FINISHED_WORK
        const occurredAt = this.now()

        const metadata: FinishedWorkMetadata = {
            workerId: workerId,
            message: message
        }

        return new FinishedWork(id, type, task.projectId, task.id, workerId, metadata, occurredAt)
    }
}