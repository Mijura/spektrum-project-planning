import { TaskDTO } from "@application/dto/task"
import { updateTaskDescription } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function updateTaskDescriptionHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        const taskDto: TaskDTO = JSON.parse(body)
        //schemaValidator(schema, commit)

		const updatedTask: TaskDTO = await updateTaskDescription.execute(taskDto)
		return Responses._200(updatedTask)

	} catch (error) {
		console.error("Error updating task description:", error)
		return errorHandler(error)
	}
}