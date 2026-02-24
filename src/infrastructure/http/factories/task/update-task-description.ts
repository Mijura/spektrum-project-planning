import { UpdateTaskDescriptionParams, UpdateTaskDescriptionUseCase } from "@app/ports/use-cases/task/update-description"
import { Task } from "@domain/task/task"
import { Auth } from "@heksagon/app"
import { extractAuthData } from "@heksagon/http"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { UserData } from "@jigjoy-ai/auth"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createUpdateTaskDescriptionHandler(updateTaskDescriptionUseCase: UpdateTaskDescriptionUseCase) {
	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!event.body) throw new ValidationError("No page body")

			const auth: Auth<UserData> = extractAuthData(event.headers)
			const params: UpdateTaskDescriptionParams = JSON.parse(event.body)

			const updatedTask: Task = await updateTaskDescriptionUseCase.execute(auth, params)
			const updatedTaskDTO: TaskDTO = TaskMapper.toDTO(updatedTask)
			return Responses._200(updatedTaskDTO)
		} catch (error) {
			console.error("Error updating task description:", error)
			return errorHandler(error)
		}
	}
}
