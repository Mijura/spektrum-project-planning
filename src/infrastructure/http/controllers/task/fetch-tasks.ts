import { TaskDto } from "@application/dto/task"
import { TaskDtoMapper } from "@application/mappers/task-dto-mapper"
import { Task } from "@domain/entities/task"
import { fetchTasks } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectsHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        //TODO: Get from param from request instead of body
        const { projectId } = JSON.parse(body)
        //schemaValidator(schema, commit)
		
		let response = null

        try {
            console.log(`Fetching all tasks for project: ${projectId}`)
			const tasks: Task[] = await fetchTasks.execute(projectId)
			const taskDtos: TaskDto[] = TaskDtoMapper.toDtos(tasks)
            response = {
				statusCode: 200,
				body: JSON.stringify({ taskDtos })
			}
		} catch (error) {
			console.error("Error fetching tasks:", error)
			throw new Error(`Error fetching tasks.`)
		}

		return Responses._200(response)
	} catch (error) {
		return errorHandler(error)
	}
}