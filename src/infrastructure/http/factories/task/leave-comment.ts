import { LeaveCommentParams, LeaveCommentUseCase } from "@app/ports/use-cases/task/leave-comment"
import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { AuthContext, extractAuthContext } from "@jigjoy-ai/auth-context"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createLeaveCommentHandler(leaveCommentUseCase: LeaveCommentUseCase) {
	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!event.body) throw new ValidationError("No request body provided")

			const { taskId, commentText } = JSON.parse(event.body)

			const authContext: AuthContext = extractAuthContext(event.headers)

			const params: LeaveCommentParams = {
				taskId,
				commentText,
			}
			const task: Task = await leaveCommentUseCase.execute(params, authContext)
			const taskDTO: TaskDTO = TaskMapper.toDTO(task)
			return Responses._200(taskDTO)
		} catch (error) {
			console.error("Error leaving comment:", error)
			return errorHandler(error)
		}
	}
}
