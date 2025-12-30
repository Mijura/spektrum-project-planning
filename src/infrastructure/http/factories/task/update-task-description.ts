import { TaskDTO } from "@app/dto/task"
import { UpdateTaskDescriptionPort } from "@app/ports/use-cases/task/update-description"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createUpdateTaskDescriptionHandler(updateTaskDescription: UpdateTaskDescriptionPort) {

	return async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!body) throw new ValidationError("No page body")

			const taskDto: TaskDTO = JSON.parse(body)

			const updatedTask: TaskDTO = await updateTaskDescription.execute(taskDto)
			return Responses._200(updatedTask)

		} catch (error) {
			console.error("Error updating task description:", error)
			return errorHandler(error)
		}
	}
}

