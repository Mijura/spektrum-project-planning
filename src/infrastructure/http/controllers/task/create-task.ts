import { Task } from "@domain/entities/task"
import { createTask } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function createTaskHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")


        const { projectId, title, description } = JSON.parse(body)
        //schemaValidator(schema, commit)
		
		try {
			const task: Task = await createTask.execute(projectId, title, description)
			return Responses._201(task)
		} catch (error) {
			console.error("Error creating task:", error)
			throw new Error(`Error creating task.`)
		}

	} catch (error) {
		return errorHandler(error)
	}
}