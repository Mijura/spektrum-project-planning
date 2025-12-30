import { ProjectDTO } from "@app/dto/project"
import { FetchProjectsPort } from "@app/ports/use-cases/project/fetch-projects"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createFetchProjectsHandler(fetchProjects: FetchProjectsPort) {

	return async function fetchProjectsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const ownerId = event.pathParameters?.ownerId
			if (!ownerId) 
				throw new ValidationError("Missing path parameter: ownerId")

			console.log(`Fetching all projects for ${ownerId}`)
			const projects: ProjectDTO[] = await fetchProjects.execute(ownerId)
			return Responses._200(projects)
			
		} catch (error) {
			console.error("Error fetching projects:", error)
			return errorHandler(error)
		}
	}
}

