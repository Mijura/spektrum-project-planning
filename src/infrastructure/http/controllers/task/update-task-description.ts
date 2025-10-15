import { TaskDto } from "@application/dto/task"
import { Task } from "@domain/entities/task"
import { updateTaskDescription } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function updateTaskDescriptionHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        const taskDto: TaskDto = JSON.parse(body)
        //schemaValidator(schema, commit)
		
		let response = null

        try {
			
			const updatedTask: Task = await updateTaskDescription.execute(taskDto)
            response = {
				statusCode: 200,
				body: JSON.stringify({ updatedTask })
			}
		} catch (error) {
			console.error("Error updating task description:", error)
			throw new Error("Error updating task description." )
		}

		return Responses._200(response)
	} catch (error) {
		return errorHandler(error)
	}
}