import { TaskDTO } from "@application/dto/task"
import { FetchTasksPort } from "@application/ports/use-cases/task/fetch-tasks"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createFetchTasksHandler(fetchTasks: FetchTasksPort) {

	return async function fetchTasksHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const projectId = event.pathParameters?.projectId
			
			if (!projectId) 
				throw new ValidationError("Missing path parameter: projectId")

			console.log(`Fetching all tasks for project: ${projectId}`)
			const taskDtos: TaskDTO[] = await fetchTasks.execute(projectId)
				
			return Responses._200(taskDtos)

		} catch (error) {
			console.error("Error fetching tasks:", error)
			return errorHandler(error)
		}
	}
}

