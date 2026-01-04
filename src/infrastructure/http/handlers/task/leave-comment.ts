import { createLeaveCommentHandler } from "@infra/http/factories/task/leave-comment"
import { leaveComment } from "@infra/dependencies"

export const handler = createLeaveCommentHandler(leaveComment)
