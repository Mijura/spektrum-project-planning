import { TaskExecution } from "@domain/entities/task-execution"
import { fetchTimelineByProjectId } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectTimelineHandler( event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {

        const qs = event.queryStringParameters || {}

        const projectId = qs.projectId
        const pageNumber = qs.page ? parseInt(qs.page, 10) : 1
        const pageSize = qs.size ? parseInt(qs.size, 10) : 25

        if (!projectId) {
            throw new ValidationError("Missing required query param: projectId")
        }

        if (Number.isNaN(pageNumber) || Number.isNaN(pageSize)) {
            throw new ValidationError("Invalid page or size query params")
        }
		
        const pagination = {
            pageNumber: pageNumber,
            pageSize: pageSize
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