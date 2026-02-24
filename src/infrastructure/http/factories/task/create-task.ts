import { CreateTaskParams, CreateTaskUseCase } from "@app/ports/use-cases/task/create-task"
import { Task } from "@domain/task/task"
import { Auth } from "@heksagon/app"
import { extractAuthData } from "@heksagon/http"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { UserData } from "@jigjoy-ai/auth"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createCreateTaskHandler(createTaskUseCase: CreateTaskUseCase) {
	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!event.body) throw new ValidationError("No page body")

			const auth: Auth<UserData> = extractAuthData(event.headers)
			const params: CreateTaskParams = JSON.parse(event.body)

			const task: Task = await createTaskUseCase.execute(auth, params)

			const taskDTO: TaskDTO = TaskMapper.toDTO(task)
			return Responses._201(taskDTO)
		} catch (error) {
			console.error("Error creating task:", error)
			return errorHandler(error)
		}
	}
}
