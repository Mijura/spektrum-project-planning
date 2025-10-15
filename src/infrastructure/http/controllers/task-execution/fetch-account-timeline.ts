import { TaskExecution } from "@domain/entities/task-execution"
import { fetchTimelineByProjectId } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchAccountTimelineHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        //TODO: Get from param from query instead of body
        const { projectId, page, size } = JSON.parse(body)
        //schemaValidator(schema, commit)
		
        const pagination = {
            pageNumber: parseInt(page),
            pageSize: parseInt(size)
        }

		let response = null

        try {
            const activities: TaskExecution[] = await fetchTimelineByProjectId.execute(projectId, pagination)
            response = {
				statusCode: 200,
				body: JSON.stringify({ activities })
			}
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching project timeline:", error)
			throw new Error(`Error fetching project timeline.`)
		}

		return Responses._200(response)
	} catch (error) {
		return errorHandler(error)
	}
}