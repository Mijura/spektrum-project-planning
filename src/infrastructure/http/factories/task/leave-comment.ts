import { TaskDTO } from "@app/dto/task"
import { LeaveCommentPort } from "@app/ports/use-cases/task/leave-comment"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createLeaveCommentHandler(leaveCommentUseCase: LeaveCommentPort) {

    return async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

		try {
            
            if (!body) 
                throw new ValidationError("No request body provided")


			const { taskId, commentText, authorId } = JSON.parse(body)

			const task: TaskDTO = await leaveCommentUseCase.execute(taskId, commentText, authorId)

			return Responses._200(task)

		} catch (error) {
			console.error("Error leaving comment:", error)
			return errorHandler(error)
		}
	}
}