import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"

export type LeaveCommentParams = {
	taskId: string
	commentText: string
}

export type LeaveCommentUseCase = AuthenticatedUseCase<LeaveCommentParams, Task>
