import { LeaveCommentUseCase } from "@app/ports/use-cases/task/leave-comment"
import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createLeaveCommentHandler(leaveCommentUseCase: LeaveCommentUseCase) {
	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!event.body) throw new ValidationError("No request body provided")

			const { taskId, commentText } = JSON.parse(event.body)

			const userId = event.headers?.["x-user-id"] || event.headers?.["X-User-Id"]

			if (!userId) throw new ValidationError("Missing header: x-user-id or X-User-Id")

			const task: Task = await leaveCommentUseCase.execute(taskId, commentText, userId)
			const taskDTO: TaskDTO = TaskMapper.toDTO(task)
			return Responses._200(taskDTO)
		} catch (error) {
			console.error("Error leaving comment:", error)
			return errorHandler(error)
		}
	}
}
