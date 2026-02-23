import { LeaveCommentParams, LeaveCommentUseCase } from "@app/ports/use-cases/task/leave-comment"
import { Task } from "@domain/task/task"
import { Auth } from "@heksagon/app"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createLeaveCommentHandler(leaveCommentUseCase: LeaveCommentUseCase) {
	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!event.body) throw new ValidationError("No request body provided")

			const auth: Auth<UserData> = extractAuthData(event)
			const params: LeaveCommentParams = JSON.parse(event.body)

			const task: Task = await leaveCommentUseCase.execute(auth, params)
			const taskDTO: TaskDTO = TaskMapper.toDTO(task)
			return Responses._200(taskDTO)
		} catch (error) {
			console.error("Error leaving comment:", error)
			return errorHandler(error)
		}
	}
}
