import { FetchTasksParams, FetchTasksUseCase } from "@app/ports/use-cases/task/fetch-tasks"
import { Task } from "@domain/task/task"
import { Auth } from "@heksagon/app"
import { extractAuthData } from "@heksagon/http"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { UserData } from "@jigjoy-ai/auth"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createFetchTasksHandler(fetchTasksUseCase: FetchTasksUseCase) {
	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			const projectId = event.pathParameters?.projectId

			if (!projectId) throw new ValidationError("Missing path parameter: projectId")

			console.log(`Fetching all tasks for project: ${projectId}`)

			const auth: Auth<UserData> = extractAuthData(event.headers)

			const params: FetchTasksParams = {
				projectId,
			}

			const tasks: Task[] = await fetchTasksUseCase.execute(auth, params)
			const taskDTOs: TaskDTO[] = TaskMapper.toDTOs(tasks)

			return Responses._200(taskDTOs)
		} catch (error) {
			console.error("Error fetching tasks:", error)
			return errorHandler(error)
		}
	}
}
