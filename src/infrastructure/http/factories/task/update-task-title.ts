import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { UpdateTaskTitleParams, UpdateTaskTitleUseCase } from "@app/ports/use-cases/task/update-title"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createUpdateTaskTitleHandler(updateTaskTitleUseCase: UpdateTaskTitleUseCase) {
	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!event.body) throw new ValidationError("No page body")

			const auth: Auth<UserData> = extractAuthData(event)
			const params: UpdateTaskTitleParams = JSON.parse(event.body)

			const updatedTask: Task = await updateTaskTitleUseCase.execute(auth, params)
			const updatedTaskDTO: TaskDTO = TaskMapper.toDTO(updatedTask)
			return Responses._200(updatedTaskDTO)
		} catch (error) {
			console.error("Error updating task title:", error)
			return errorHandler(error)
		}
	}
}
