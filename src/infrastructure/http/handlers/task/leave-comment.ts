import { LeaveCommentUseCase } from "@app/ports/use-cases/task/leave-comment"
import { LeaveComment } from "@app/use-cases/task/leave-comment"
import { createLeaveCommentHandler } from "@infra/http/factories/task/leave-comment"
import { taskRepository } from "@infra/repositories/task-repository"

export const leaveComment: LeaveCommentUseCase = new LeaveComment(taskRepository)

export const handler = createLeaveCommentHandler(leaveComment)
