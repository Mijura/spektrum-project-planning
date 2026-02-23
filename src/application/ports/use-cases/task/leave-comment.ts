import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type LeaveCommentParams = {
	taskId: string
	commentText: string,
	authorName: string
}

export type LeaveCommentUseCase = AuthenticatedUseCase<UserData, LeaveCommentParams, Task>
