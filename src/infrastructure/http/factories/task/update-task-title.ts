import { TaskDTO } from "@app/dto/task"
import { UpdateTaskTitlePort } from "@app/ports/use-cases/task/update-title"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createUpdateTaskTitleHandler(updateTaskTitle: UpdateTaskTitlePort) {

	return async function updateTaskTitleHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!body) throw new ValidationError("No page body")

			const taskDto: TaskDTO = JSON.parse(body)

			const updatedTask: TaskDTO = await updateTaskTitle.execute(taskDto)
			return Responses._200(updatedTask)

		} catch (error) {
			console.error("Error updating task title:", error)
			return errorHandler(error)
		}
	}
}

