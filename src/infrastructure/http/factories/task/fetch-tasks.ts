import { FetchTasksPort } from "@app/ports/use-cases/task/fetch-tasks"
import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { TaskDTO } from "@jigjoy-io/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createFetchTasksHandler(fetchTasks: FetchTasksPort) {

	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			const projectId = event.pathParameters?.projectId
			
			if (!projectId) 
				throw new ValidationError("Missing path parameter: projectId")

			console.log(`Fetching all tasks for project: ${projectId}`)
			
			const tasks: Task[] = await fetchTasks.execute(projectId)
			const taskDTOs: TaskDTO[] = TaskMapper.toDTOs(tasks)
			
			return Responses._200(taskDTOs)

		} catch (error) {
			console.error("Error fetching tasks:", error)
			return errorHandler(error)
		}
	}
}

