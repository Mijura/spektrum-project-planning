import { TaskDTO } from "@app/dto/task"
import { CreateTaskPort } from "@app/ports/use-cases/task/create-task"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createCreateTaskHandler(createTask: CreateTaskPort) {

	return async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		
		try {
			if (!body) 
				throw new ValidationError("No page body")

			const { projectId, title, description } = JSON.parse(body)
			
			const task: TaskDTO = await createTask.execute(projectId, title, description)
			return Responses._201(task)

		} catch (error) {
			console.error("Error creating task:", error)
			return errorHandler(error)
		}
	}
}

