import { LeaveCommentPort } from "@app/ports/use-cases/task/leave-comment"
import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { Task as TaskDTO } from "@jigjoy-io/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createLeaveCommentHandler(leaveComment: LeaveCommentPort) {
	return async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!body) throw new ValidationError("No request body provided")

			const { taskId, commentText, authorId } = JSON.parse(body)

			const task: Task = await leaveComment.execute(taskId, commentText, authorId)
			const taskDTO: TaskDTO = TaskMapper.toDTO(task)
			return Responses._200(taskDTO)
		} catch (error) {
			console.error("Error leaving comment:", error)
			return errorHandler(error)
		}
	}
}
