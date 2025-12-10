import { TaskDto } from "@application/dto/task"
import { Task } from "@domain/entities/task"
import { updateTaskTitle } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function updateTaskTitleHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        const taskDto: TaskDto = JSON.parse(body)
        //schemaValidator(schema, commit)

		const updatedTask: Task = await updateTaskTitle.execute(taskDto)
		return Responses._200(updatedTask)

	} catch (error) {
		console.error("Error updating task title:", error)
		return errorHandler(error)
	}
}